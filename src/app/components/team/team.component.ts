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
          <div class="max-w-2xl mx-auto text-center py-12 px-6 rounded-2xl bg-midnight/70 border border-violet-primary/20 backdrop-blur-sm">
            <div class="w-12 h-12 rounded-full bg-violet-primary/10 border border-violet-primary/30 mx-auto mb-4 flex items-center justify-center">
              <svg class="w-6 h-6 text-violet-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"/>
              </svg>
            </div>

            <h3 class="text-xl font-semibold text-text-primary mb-2">{{ i18n.t('team.errorTitle') }}</h3>
            <p class="text-text-muted">{{ membersErrorHint() }}</p>
            <p class="text-text-muted/80 text-sm mt-2 break-words">{{ membersError() }}</p>

            <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button (click)="retry()"
                      class="px-5 py-2.5 text-sm text-violet-primary border border-violet-primary/30 rounded-lg hover:bg-violet-primary/10 transition-colors">
                {{ i18n.t('team.retry') }}
              </button>

              <a href="https://github.com/K-Forge" target="_blank" rel="noopener"
                 class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-violet-primary/40 bg-violet-primary/15 text-violet-glow hover:bg-violet-primary/25 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
                </svg>
                {{ i18n.t('team.errorCta') }}
              </a>
            </div>
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
                          <p class="text-text-primary truncate min-w-0 self-center">{{ project.repoName }}</p>
                          <div class="text-right shrink-0 pl-2">
                            <p class="text-text-muted text-xs whitespace-nowrap">{{ formatActivityDate(project.lastActivityAt) }}</p>
                            <p class="text-text-muted text-xs whitespace-nowrap mt-0.5">{{ project.commits }} {{ i18n.t('team.commits') }}</p>
                          </div>
                        </a>
                      }
                    </div>
                  } @else {
                    <p class="text-xs text-text-muted">{{ i18n.t('team.noProjects') }}</p>
                  }
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

  membersErrorHint(): string {
    const currentError = this.membersError();
    if (!currentError) return this.i18n.t('team.errorUnavailable');

    const rateLimitPattern = /(403|rate limit|api rate limit exceeded)/i;
    return rateLimitPattern.test(currentError)
      ? this.i18n.t('team.errorRateLimit')
      : this.i18n.t('team.errorUnavailable');
  }

  formatActivityDate(value?: string | null): string {
    if (!value) {
      return this.i18n.t('team.noActivity');
    }

    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
