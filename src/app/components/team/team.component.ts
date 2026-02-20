import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { ApiErrorComponent } from '../../shared/api-error.component';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-team',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FadeInDirective, SectionHeaderComponent, ApiErrorComponent],
  template: `
    <section class="team-people-bg relative px-6 py-20 md:py-24 bg-surface min-h-screen flex items-center">
      <div class="max-w-6xl mx-auto w-full">

        <!-- Section Header -->
        <app-section-header
          [title]="i18n.t('team.title')"
          [subtitle]="i18n.t('team.subtitle')" />

        <!-- Loading Skeleton -->
        @if (membersLoading()) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @for (i of skeletonSlots; track i) {
              <div class="flex flex-col items-center gap-4 p-6">
                <div class="w-24 h-24 rounded-full bg-surface-light animate-pulse"></div>
                <div class="h-4 w-20 bg-surface-light rounded animate-pulse"></div>
              </div>
            }
          </div>
        }

        <!-- Error -->
        @if (membersError()) {
          <app-api-error
            [errorMessage]="membersError()!"
            [errorTitle]="i18n.t('team.errorTitle')"
            [errorHint]="githubService.getErrorHint(membersError(), 'team')"
            [retryLabel]="i18n.t('team.retry')"
            [ctaLabel]="i18n.t('team.errorCta')"
            ctaUrl="https://github.com/K-Forge"
            (retryClicked)="retry()" />
        }

        <!-- Members Grid -->
        @if (!membersLoading() && !membersError() && members().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (member of members(); track member.id; let i = $index) {
              <div class="group p-6 rounded-2xl bg-midnight border border-surface-light
                          hover:border-violet-primary/40 transition-all duration-500 flex flex-col h-full"
                   appFadeIn="up" [fadeDelay]="i * 100">

                <!-- Member header (avatar + name) -->
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

                <!-- Projects list -->
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
    .team-people-bg { isolation: isolate; }

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

    .team-people-bg > div { position: relative; z-index: 1; }
  `]
})
export class TeamComponent implements OnInit {
  readonly i18n = inject(I18nService);
  readonly githubService = inject(GithubService);

  /** Expose service signals to template */
  readonly members = this.githubService.members;
  readonly membersLoading = this.githubService.membersLoading;
  readonly membersError = this.githubService.membersError;

  readonly skeletonSlots = Array.from({ length: 4 }, (_, i) => i);

  ngOnInit(): void {
    this.githubService.fetchMembers();
  }

  retry(): void {
    this.githubService.fetchMembers();
  }

  formatActivityDate(value?: string | null): string {
    if (!value) return this.i18n.t('team.noActivity');

    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
