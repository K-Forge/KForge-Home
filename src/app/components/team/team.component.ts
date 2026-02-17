import { Component, OnInit, inject } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="team" class="team-people-bg relative px-6 py-20 md:py-24 bg-surface min-h-screen flex items-center">
      <div class="max-w-6xl mx-auto w-full">
        <!-- Section Header -->
        <div class="text-center mb-14" appFadeIn="up">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-text-primary">
            <span class="text-violet-primary">{{ i18n.t('team.title') }}</span>
          </h2>
          <div class="h-1 w-16 bg-violet-primary mx-auto mb-6 rounded-full"></div>
          <p class="text-lg text-text-muted max-w-xl mx-auto">
            {{ i18n.t('team.subtitle') }}
          </p>
        </div>

        <!-- Loading -->
        @if (membersLoading()) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @for (i of skeletons; track i) {
              <div class="flex flex-col items-center gap-4 p-6">
                <div class="w-24 h-24 rounded-full bg-surface-light animate-pulse"></div>
                <div class="h-4 w-20 bg-surface-light rounded animate-pulse"></div>
              </div>
            }
          </div>
        }

        <!-- Error -->
        @if (membersError()) {
          <div class="text-center py-12">
            <p class="text-text-muted">{{ i18n.t('team.error') }}</p>
            <button (click)="retry()" 
                    class="mt-4 px-4 py-2 text-sm text-violet-primary border border-violet-primary/30 
                           rounded-lg hover:bg-violet-primary/10 transition-colors">
              {{ i18n.t('team.retry') }}
            </button>
          </div>
        }

        <!-- Members Grid -->
        @if (!membersLoading() && !membersError() && members().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (member of members(); track member.id; let i = $index) {
              <div class="group p-6 rounded-2xl bg-midnight border border-surface-light 
                     hover:border-violet-primary/40 transition-all duration-500 flex flex-col h-full"
                   appFadeIn="up" [fadeDelay]="i * 100">
                <a [href]="member.html_url" target="_blank" rel="noopener"
                   class="flex items-center gap-4 mb-5">
                  <div class="relative">
                    <img [src]="member.avatar_url" [alt]="member.login"
                         class="w-16 h-16 rounded-full object-cover border-2 border-surface-light 
                                group-hover:border-violet-primary transition-colors duration-300"
                         loading="lazy" />
                    <div class="absolute inset-0 rounded-full bg-violet-primary/0 
                                group-hover:bg-violet-primary/10 transition-colors duration-300"></div>
                  </div>
                  <div>
                    <p class="text-text-primary font-medium group-hover:text-violet-primary transition-colors">
                      {{ member.login }}
                    </p>
                    <p class="text-xs text-text-muted mt-1">{{ i18n.t('team.member') }}</p>
                  </div>
                </a>

                <div class="space-y-3">
                  <p class="text-xs uppercase tracking-wide text-text-muted/80">{{ i18n.t('team.projects') }}</p>
                  @if (member.projects && member.projects.length > 0) {
                    <div class="space-y-2">
                      @for (project of member.projects; track project.repoName) {
                        <a [href]="project.repoUrl" target="_blank" rel="noopener"
                           class="flex items-center justify-between gap-2 text-sm rounded-lg px-2 py-1.5 
                                  bg-surface/50 hover:bg-surface-light/50 transition-colors">
                          <span class="text-text-primary truncate">{{ project.repoName }}</span>
                          <span class="text-text-muted text-xs whitespace-nowrap">{{ project.commits }} {{ i18n.t('team.commits') }}</span>
                        </a>
                      }
                    </div>
                  } @else {
                    <p class="text-xs text-text-muted">{{ i18n.t('team.noProjects') }}</p>
                  }
                </div>

                <div class="pt-3 mt-auto border-t border-surface-light/40">
                  <p class="text-xs text-text-muted">
                    <span class="text-text-muted/80">{{ i18n.t('team.lastActivity') }}:</span>
                    {{ formatActivityDate(member.lastActivityAt) }}
                  </p>
                </div>
              </div>
            }
          </div>
        }

        <!-- Empty State -->
        @if (!membersLoading() && !membersError() && members().length === 0) {
          <div class="text-center py-12">
            <p class="text-text-muted">{{ i18n.t('team.empty') }}</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
      .team-people-bg {
        isolation: isolate;
      }

      .team-people-bg::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url('/assets/images/team.webp');
        background-repeat: no-repeat;
        background-size: 440px auto;
        background-position: right 3% bottom 6%;
        filter: brightness(0) saturate(100%) invert(53%) sepia(73%) saturate(1405%) hue-rotate(227deg) brightness(108%) contrast(98%);
        opacity: 0.2;
        pointer-events: none;
        z-index: 0;
      }

      @media (max-width: 1024px) {
        .team-people-bg::before {
          background-size: 340px auto;
          background-position: right -20px bottom 5%;
        }
      }

      @media (max-width: 768px) {
        .team-people-bg::before {
          background-size: 250px auto;
          background-position: right -44px bottom 4%;
          opacity: 0.16;
        }
      }

      .team-people-bg > div {
        position: relative;
        z-index: 1;
      }
    `]
})
export class TeamComponent implements OnInit {
  i18n = inject(I18nService);
  private githubService = inject(GithubService);

  members = this.githubService.members;
  membersLoading = this.githubService.membersLoading;
  membersError = this.githubService.membersError;

  skeletons = Array.from({ length: 4 });

  ngOnInit(): void {
    this.githubService.fetchMembers();
  }

  retry(): void {
    this.githubService.fetchMembers();
  }

  formatActivityDate(value?: string | null): string {
    if (!value) {
      return this.i18n.t('team.noActivity');
    }

    const language = this.i18n.lang() === 'es' ? 'es-CO' : 'en-US';
    return new Date(value).toLocaleDateString(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
