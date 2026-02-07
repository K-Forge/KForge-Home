import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GithubRepo } from '../models/github-repo.interface';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly GITHUB_API = 'https://api.github.com/users/K-Forge/repos';
  private readonly PRIORITY_REPOS = ['K-APP', 'Gretta', 'Tienda-K', 'KomidaGPT'];

  // Signals para manejo de estado reactivo
  repos = signal<GithubRepo[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  async fetchRepos(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      const response = await fetch(this.GITHUB_API);
      
      if (!response.ok) {
        throw new Error(`Error fetching repos: ${response.statusText}`);
      }

      const allRepos: GithubRepo[] = await response.json();
      
      // Filtrar y priorizar los repos específicos
      const filteredRepos = this.filterAndPrioritizeRepos(allRepos);
      
      this.repos.set(filteredRepos);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching GitHub repos:', err);
    } finally {
      this.loading.set(false);
    }
  }

  private filterAndPrioritizeRepos(repos: GithubRepo[]): GithubRepo[] {
    // Separar repos prioritarios y otros
    const priorityRepos: GithubRepo[] = [];
    const otherRepos: GithubRepo[] = [];

    repos.forEach(repo => {
      if (this.PRIORITY_REPOS.includes(repo.name)) {
        priorityRepos.push(repo);
      } else {
        otherRepos.push(repo);
      }
    });

    // Ordenar repos prioritarios según el orden definido
    priorityRepos.sort((a, b) => {
      const indexA = this.PRIORITY_REPOS.indexOf(a.name);
      const indexB = this.PRIORITY_REPOS.indexOf(b.name);
      return indexA - indexB;
    });

    // Ordenar otros repos por fecha de actualización
    otherRepos.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    // Combinar: prioritarios primero, luego otros (máximo 8 repos en total)
    return [...priorityRepos, ...otherRepos].slice(0, 8);
  }

  getLanguageColor(language: string | null): string {
    const colors: { [key: string]: string } = {
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
    };

    return colors[language || ''] || '#6e7681';
  }
}
