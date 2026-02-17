import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, catchError, map, switchMap } from 'rxjs/operators';
import { of, forkJoin, Observable } from 'rxjs';
import { GithubRepo } from '../models/github-repo.interface';
import { GithubMember, GithubMemberProject } from '../models/github-member.interface';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  // ── Configuration ──────────────────────────────────────────────
  private readonly GITHUB_ORG = 'K-Forge';
  private readonly API_BASE = 'https://api.github.com';
  private readonly PRIORITY_REPOS = ['K-APP', 'Gretta', 'Tienda-K', 'KomidaGPT'];
  private readonly REPOS_CACHE_KEY = 'kforge_repos_v2';
  private readonly MEMBERS_CACHE_KEY = 'kforge_members_enriched_v3';
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  private readonly http = inject(HttpClient);
  private readonly i18n = inject(I18nService);

  // ── Repos state (signals) ─────────────────────────────────────
  readonly repos = signal<GithubRepo[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // ── Members state (signals) ───────────────────────────────────
  readonly members = signal<GithubMember[]>([]);
  readonly membersLoading = signal(true);
  readonly membersError = signal<string | null>(null);

  private get orgReposUrl(): string {
    return `${this.API_BASE}/orgs/${this.GITHUB_ORG}/repos?per_page=100&sort=updated`;
  }

  // ── Public helpers ────────────────────────────────────────────

  /** Returns a user-facing hint based on the error message and section context. */
  getErrorHint(errorMessage: string | null, section: 'projects' | 'team'): string {
    const isRateLimit = /(403|rate limit|api rate limit exceeded)/i.test(errorMessage ?? '');
    const key = isRateLimit
      ? `${section}.errorRateLimit`
      : `${section}.errorUnavailable`;
    return this.i18n.t(key);
  }

  // ── Repos fetching ────────────────────────────────────────────

  fetchRepos(): void {
    const cached = this.getCache<GithubRepo[]>(this.REPOS_CACHE_KEY);
    if (cached && cached.length > 0) {
      this.repos.set(cached);
      this.loading.set(false);
      return;
    }

    if (cached && cached.length === 0) {
      sessionStorage.removeItem(this.REPOS_CACHE_KEY);
    }

    this.loading.set(true);
    this.error.set(null);

    this.http.get<GithubRepo[]>(`${this.API_BASE}/orgs/${this.GITHUB_ORG}/repos?per_page=30&sort=updated`)
      .pipe(
        retry(2),
        catchError(err => {
          this.error.set(err?.message || 'Error al cargar proyectos');
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe(allRepos => {
        if (!allRepos) {
          return;
        }

        const filtered = this.filterAndPrioritizeRepos(allRepos);
        const normalized = this.normalizeRepoLiveDemos(filtered);
        this.repos.set(normalized);
        this.setCache(this.REPOS_CACHE_KEY, normalized);
        this.loading.set(false);
      });
  }

  // ── Members fetching ──────────────────────────────────────────

  fetchMembers(): void {
    const cached = this.getCache<GithubMember[]>(this.MEMBERS_CACHE_KEY);
    if (cached && cached.length > 0) {
      this.members.set(this.sortMembersByRecentActivity(cached));
      this.membersLoading.set(false);
      return;
    }

    if (cached && cached.length === 0) {
      sessionStorage.removeItem(this.MEMBERS_CACHE_KEY);
    }

    this.membersLoading.set(true);
    this.membersError.set(null);

    this.http.get<GithubMember[]>(`${this.API_BASE}/orgs/${this.GITHUB_ORG}/members?per_page=20`)
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
                  const memberCommitDateRequests = members.map(member =>
                    this.fetchMemberRepoLastCommitDates(member.login, repos)
                  );

                  return forkJoin(memberCommitDateRequests).pipe(
                    map(commitDatesByMember => members.map((member, index) => {
                      const commitDatesByRepo = commitDatesByMember[index];
                      const memberProjects = (projectsByMember.get(member.login) || []).map(project => ({
                        ...project,
                        lastActivityAt: commitDatesByRepo[project.repoName] || project.lastActivityAt,
                      }));

                      const sortedProjects = this.sortProjectsByRecentCommit(memberProjects).slice(0, 5);

                      return {
                        ...member,
                        projects: sortedProjects,
                        lastActivityAt: this.getMostRecentDate(Object.values(commitDatesByRepo)),
                      };
                    }))
                  );
                })
              );
            })
          );
        }),
        catchError(err => {
          this.membersError.set(err?.message || 'Error al cargar equipo');
          this.membersLoading.set(false);
          return of(null);
        })
      )
      .subscribe(data => {
        if (!data) {
          return;
        }

        const sortedMembers = this.sortMembersByRecentActivity(data);
        this.members.set(sortedMembers);
        this.setCache(this.MEMBERS_CACHE_KEY, sortedMembers);
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
        `${this.API_BASE}/repos/${this.GITHUB_ORG}/${repoName}/contributors?per_page=100`
      )
      .pipe(catchError(() => of([])));
  }

  private fetchMemberRepoLastCommitDates(login: string, repos: GithubRepo[]): Observable<Record<string, string | null>> {
    const commitDateRequests = repos.map(repo =>
      this.http
        .get<Array<{ commit?: { author?: { date?: string }; committer?: { date?: string } } }>>(
          `${this.API_BASE}/repos/${this.GITHUB_ORG}/${repo.name}/commits?author=${login}&per_page=1`
        )
        .pipe(
          map(commits => {
            const first = commits[0];
            const date = first?.commit?.author?.date || first?.commit?.committer?.date || null;
            return { repoName: repo.name, date };
          }),
          catchError(() => of({ repoName: repo.name, date: null }))
        )
    );

    if (!commitDateRequests.length) {
      return of({});
    }

    return forkJoin(commitDateRequests).pipe(
      map(entries => entries.reduce<Record<string, string | null>>((accumulator, entry) => {
        accumulator[entry.repoName] = entry.date;
        return accumulator;
      }, {})),
      catchError(() => of({}))
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
          lastActivityAt: repo.updated_at,
        });
        projectsByMember.set(contributor.login, current);
      });
    });

    return projectsByMember;
  }

  private sortProjectsByRecentCommit(projects: GithubMemberProject[]): GithubMemberProject[] {
    return [...projects].sort((a, b) => {
      const timeA = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
      const timeB = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  private getMostRecentDate(dates: Array<string | null | undefined>): string | null {
    const sorted = dates
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return sorted[0] || null;
  }

  // ── Repo helpers ──────────────────────────────────────────────

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

  private normalizeRepoLiveDemos(repos: GithubRepo[]): GithubRepo[] {
    return repos.map(repo => {
      if (repo.name !== 'KForge-Home') {
        return repo;
      }

      return {
        ...repo,
        homepage: 'https://kforge-home.vercel.app',
      };
    });
  }

  // ── Language color map ────────────────────────────────────────

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

  // ── Cache helpers ─────────────────────────────────────────────

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
