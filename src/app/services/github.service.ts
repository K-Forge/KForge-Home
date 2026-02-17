import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, catchError, map, switchMap } from 'rxjs/operators';
import { of, forkJoin, Observable } from 'rxjs';
import { GithubRepo } from '../models/github-repo.interface';
import { GithubMember, GithubMemberProject } from '../models/github-member.interface';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly ORG = 'K-Forge';
  private readonly API_BASE = 'https://api.github.com';
  private readonly PRIORITY_REPOS = ['K-APP', 'Gretta', 'Tienda-K', 'KomidaGPT'];
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  // Repos state
  readonly repos = signal<GithubRepo[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // Members state
  readonly members = signal<GithubMember[]>([]);
  readonly membersLoading = signal(true);
  readonly membersError = signal<string | null>(null);

  constructor(private http: HttpClient) { }

  private get orgReposUrl(): string {
    return `${this.API_BASE}/orgs/${this.ORG}/repos?per_page=100&sort=updated`;
  }

  fetchRepos(): void {
    const cached = this.getCache<GithubRepo[]>('kforge_repos');
    if (cached) {
      this.repos.set(cached);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.http.get<GithubRepo[]>(`${this.API_BASE}/orgs/${this.ORG}/repos?per_page=30&sort=updated`)
      .pipe(
        retry(2),
        catchError(err => {
          this.error.set(err?.message || 'Error al cargar proyectos');
          this.loading.set(false);
          return of([]);
        })
      )
      .subscribe(allRepos => {
        const filtered = this.filterAndPrioritizeRepos(allRepos);
        this.repos.set(filtered);
        this.setCache('kforge_repos', filtered);
        this.loading.set(false);
      });
  }

  fetchMembers(): void {
    const cached = this.getCache<GithubMember[]>('kforge_members_enriched_v2');
    if (cached) {
      this.members.set(this.sortMembersByRecentActivity(cached));
      this.membersLoading.set(false);
      return;
    }

    this.membersLoading.set(true);
    this.membersError.set(null);

    this.http.get<GithubMember[]>(`${this.API_BASE}/orgs/${this.ORG}/members?per_page=20`)
      .pipe(
        retry(2),
        switchMap(members => {
          if (!members.length) {
            return of([] as GithubMember[]);
          }

          return this.http.get<GithubRepo[]>(this.orgReposUrl).pipe(
            retry(2),
            map(repos => repos.filter(repo => !repo.name.startsWith('.'))),
            switchMap(repos => {
              if (!repos.length) {
                return of(members.map(member => ({
                  ...member,
                  projects: [],
                  lastActivityAt: null,
                })));
              }

              const contributorsRequests = repos.map(repo =>
                this.fetchRepoContributors(repo.name).pipe(
                  map(contributors => ({ repo, contributors }))
                )
              );

              return forkJoin(contributorsRequests).pipe(
                switchMap(repoContributors => {
                  const projectsByMember = this.buildProjectsByMember(repoContributors);
                  const activityRequests = members.map(member => this.fetchMemberLastCommitActivity(member.login, repos));

                  return forkJoin(activityRequests).pipe(
                    map(lastActivities => members.map((member, index) => ({
                      ...member,
                      projects: projectsByMember.get(member.login) || [],
                      lastActivityAt: lastActivities[index],
                    })))
                  );
                })
              );
            })
          );
        }),
        catchError(err => {
          this.membersError.set(err?.message || 'Error al cargar equipo');
          this.membersLoading.set(false);
          return of([]);
        })
      )
      .subscribe(data => {
        const sortedMembers = this.sortMembersByRecentActivity(data);
        this.members.set(sortedMembers);
        this.setCache('kforge_members_enriched_v2', sortedMembers);
        this.membersLoading.set(false);
      });
  }

  private sortMembersByRecentActivity(members: GithubMember[]): GithubMember[] {
    return [...members].sort((a, b) => {
      const timeA = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
      const timeB = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  private fetchRepoContributors(repoName: string): Observable<Array<{ login: string; contributions: number }>> {
    return this.http
      .get<Array<{ login: string; contributions: number }>>(
        `${this.API_BASE}/repos/${this.ORG}/${repoName}/contributors?per_page=100`
      )
      .pipe(catchError(() => of([])));
  }

  private fetchMemberLastCommitActivity(login: string, repos: GithubRepo[]): Observable<string | null> {
    const commitDateRequests = repos.map(repo =>
      this.http
        .get<Array<{ commit?: { author?: { date?: string }; committer?: { date?: string } } }>>(
          `${this.API_BASE}/repos/${this.ORG}/${repo.name}/commits?author=${login}&per_page=1`
        )
        .pipe(
          map(commits => {
            const first = commits[0];
            return first?.commit?.author?.date || first?.commit?.committer?.date || null;
          }),
          catchError(() => of(null))
        )
    );

    if (!commitDateRequests.length) {
      return of(null);
    }

    return forkJoin(commitDateRequests).pipe(
      map(dates => {
        const sorted = dates
          .filter((value): value is string => Boolean(value))
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        return sorted[0] || null;
      }),
      catchError(() => of(null))
    );
  }

  private buildProjectsByMember(
    repoContributors: Array<{ repo: GithubRepo; contributors: Array<{ login: string; contributions: number }> }>
  ): Map<string, GithubMemberProject[]> {
    const projectsByMember = new Map<string, GithubMemberProject[]>();

    repoContributors.forEach(({ repo, contributors }) => {
      contributors.forEach(contributor => {
        if (!contributor.login) {
          return;
        }

        const current = projectsByMember.get(contributor.login) || [];
        current.push({
          repoName: repo.name,
          repoUrl: repo.html_url,
          commits: contributor.contributions,
        });
        projectsByMember.set(contributor.login, current);
      });
    });

    projectsByMember.forEach((projects, login) => {
      projectsByMember.set(
        login,
        projects.sort((a, b) => b.commits - a.commits)
      );
    });

    return projectsByMember;
  }

  private filterAndPrioritizeRepos(repos: GithubRepo[]): GithubRepo[] {
    const priorityRepos: GithubRepo[] = [];
    const otherRepos: GithubRepo[] = [];

    repos.forEach(repo => {
      if (repo.name.startsWith('.')) return;

      if (this.PRIORITY_REPOS.includes(repo.name)) {
        priorityRepos.push(repo);
      } else {
        otherRepos.push(repo);
      }
    });

    priorityRepos.sort((a, b) =>
      this.PRIORITY_REPOS.indexOf(a.name) - this.PRIORITY_REPOS.indexOf(b.name)
    );

    otherRepos.sort((a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    return [...priorityRepos, ...otherRepos].slice(0, 8);
  }

  getLanguageColor(language: string | null): string {
    const colors: Record<string, string> = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'Python': '#3572A5',
      'Java': '#b07219',
      'Kotlin': '#A97BFF',
      'Swift': '#ffac45',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'C++': '#f34b7d',
      'C#': '#178600',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Dart': '#00B4AB',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Shell': '#89e051',
    };
    return colors[language || ''] || '#8B5CF6';
  }

  // Cache helpers
  private setCache<T>(key: string, data: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch { /* silently fail */ }
  }

  private getCache<T>(key: string): T | null {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp > this.CACHE_TTL) {
        sessionStorage.removeItem(key);
        return null;
      }
      return data as T;
    } catch {
      return null;
    }
  }
}
