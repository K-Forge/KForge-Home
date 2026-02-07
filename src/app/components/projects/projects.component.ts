import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="projects" class="min-h-screen px-6 py-20 bg-pure-black">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-5xl md:text-6xl font-bold mb-4">
            La <span class="text-lava-orange">Fragua</span>
          </h2>
          <div class="h-1 w-24 bg-lava-orange mx-auto mb-6"></div>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            Proyectos forjados con pasión, código y trabajo en equipo
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="githubService.loading()" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lava-orange"></div>
          <p class="text-gray-400 mt-4">Cargando proyectos...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="githubService.error()" class="text-center py-20">
          <div class="text-red-500 text-xl mb-4">⚠️ Error al cargar proyectos</div>
          <p class="text-gray-400">{{ githubService.error() }}</p>
        </div>

        <!-- Projects Grid -->
        <div *ngIf="!githubService.loading() && !githubService.error()" 
             class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let repo of githubService.repos()" 
               class="group bg-dark-bg border border-gray-800 rounded-xl p-6 
                      hover:border-lava-orange transition-all duration-300 
                      hover:shadow-[0_0_30px_rgba(255,69,0,0.2)] 
                      transform hover:-translate-y-2 cursor-pointer">
            
            <!-- Repo Header -->
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-xl font-bold text-white group-hover:text-lava-orange transition-colors line-clamp-1">
                {{ repo.name }}
              </h3>
              <svg class="w-5 h-5 text-gray-500 group-hover:text-lava-orange transition-colors flex-shrink-0 ml-2" 
                   fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
              </svg>
            </div>

            <!-- Description -->
            <p class="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
              {{ repo.description || 'Sin descripción disponible' }}
            </p>

            <!-- Language Badge -->
            <div class="flex items-center gap-3 mb-4" *ngIf="repo.language">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" 
                      [style.background-color]="githubService.getLanguageColor(repo.language)"></span>
                <span class="text-xs text-gray-400">{{ repo.language }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-800">
              <div class="flex items-center gap-1 text-gray-500 text-xs">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>{{ repo.stargazers_count }}</span>
              </div>
              
              <a [href]="repo.html_url" 
                 target="_blank"
                 class="text-lava-orange text-sm font-semibold hover:underline flex items-center gap-1"
                 (click)="$event.stopPropagation()">
                Ver Código
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!githubService.loading() && !githubService.error() && githubService.repos().length === 0" 
             class="text-center py-20">
          <p class="text-gray-400 text-xl">No se encontraron proyectos</p>
        </div>

        <!-- CTA -->
        <div class="text-center mt-16">
          <a href="https://github.com/K-Forge" 
             target="_blank"
             class="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-700 
                    text-gray-300 font-semibold rounded-lg hover:border-lava-orange 
                    hover:text-lava-orange transition-all duration-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
            </svg>
            Ver más en GitHub
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class ProjectsComponent implements OnInit {
  githubService = inject(GithubService);

  ngOnInit(): void {
    this.githubService.fetchRepos();
  }
}
