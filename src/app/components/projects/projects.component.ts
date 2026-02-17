import { Component, OnInit, AfterViewInit, OnDestroy, inject, ElementRef, ViewChild, NgZone } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="projects" class="relative px-6 py-20 md:py-24 bg-midnight min-h-screen flex items-center overflow-hidden">
      
      <!-- ═══ GRADIENT BASE ═══ -->
      <div class="absolute inset-0 bg-gradient-to-b from-midnight via-surface to-midnight"></div>

      <!-- ═══ FORGE GRID (subtle anvil-workshop vibe) ═══ -->
      <div class="absolute inset-0 overflow-hidden">
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="forge-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="spark-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fbbf24" stop-opacity="1"/>
              <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
            </radialGradient>
            <filter id="spark-blur" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2"/>
            </filter>
          </defs>

          <!-- Static dim forge grid -->
          <g class="opacity-[0.05]" stroke="rgba(139,92,246,1)" stroke-width="0.8" fill="none">
            <path d="M0,200 H400 L450,150 H750 L800,200 H1200"/>
            <path d="M0,400 H300 L350,350 H850 L900,400 H1200"/>
            <path d="M0,600 H500 L550,550 H700 L750,600 H1200"/>
            <path d="M300,0 V200 L350,250 V550 L300,600 V800"/>
            <path d="M600,0 V150 L650,200 V400 L600,450 V800"/>
            <path d="M900,0 V200 L950,250 V400 L900,450 V800"/>
          </g>

          <!-- Animated forge traces -->
          <g fill="none" stroke-width="1.2" filter="url(#forge-glow)">
            <path d="M0,200 H400 L450,150 H750 L800,200 H1200" class="forge-trace forge-t1"/>
            <path d="M0,400 H300 L350,350 H850 L900,400 H1200" class="forge-trace forge-t2"/>
            <path d="M0,600 H500 L550,550 H700 L750,600 H1200" class="forge-trace forge-t3"/>
            <path d="M300,0 V200 L350,250 V550 L300,600 V800" class="forge-trace forge-t4"/>
            <path d="M600,0 V150 L650,200 V400 L600,450 V800" class="forge-trace forge-t5"/>
            <path d="M900,0 V200 L950,250 V400 L900,450 V800" class="forge-trace forge-t6"/>
          </g>

          <!-- Forge junction nodes -->
          <g>
            <circle cx="400" cy="200" r="2" class="forge-node fn-1"/>
            <circle cx="750" cy="150" r="2" class="forge-node fn-2"/>
            <circle cx="350" cy="350" r="2" class="forge-node fn-3"/>
            <circle cx="850" cy="400" r="2" class="forge-node fn-4"/>
            <circle cx="550" cy="550" r="2" class="forge-node fn-5"/>
            <circle cx="650" cy="200" r="2" class="forge-node fn-6"/>
          </g>
        </svg>
      </div>

      <!-- ═══ ANIMATED HAMMERS + SPARKS (Canvas) ═══ -->
      <canvas #hammerCanvas class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 1;"></canvas>

      <!-- ═══ GRAIN OVERLAY ═══ -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <filter id="proj-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#proj-grain)"/>
      </svg>

      <!-- Soft blur veil -->
      <div class="absolute inset-0 bg-midnight/25 backdrop-blur-[0.5px]"></div>

      <!-- Glow Blobs -->
      <div class="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-violet-primary/[0.06] rounded-full blur-[180px] animate-pulse-glow"></div>
      <div class="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-violet-deep/[0.05] rounded-full blur-[160px] animate-pulse-glow"
           style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-violet-glow/[0.03] rounded-full blur-[170px] animate-pulse-glow"
           style="animation-delay: 4s;"></div>
      <!-- Warm forge glow at centre -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-amber-500/[0.03] rounded-full blur-[120px] animate-pulse-glow"
           style="animation-delay: 1s;"></div>

      <!-- ═══ CONTENT (z-10 so it sits above the effects) ═══ -->
      <div class="relative z-10 max-w-7xl mx-auto w-full">
        <!-- Section Header -->
        <div class="text-center mb-14" appFadeIn="up">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-text-primary">
            <span class="text-violet-primary">{{ i18n.t('projects.title') }}</span>
          </h2>
          <div class="h-1 w-16 bg-violet-primary mx-auto mb-6 rounded-full"></div>
          <p class="text-lg text-text-muted max-w-xl mx-auto">
            {{ i18n.t('projects.subtitle') }}
          </p>
        </div>

        <!-- Loading Skeleton -->
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (i of skeletons; track i) {
              <div class="p-6 rounded-2xl bg-surface border border-surface-light">
                <div class="h-5 w-2/3 bg-surface-light rounded animate-pulse mb-4"></div>
                <div class="h-3 w-full bg-surface-light rounded animate-pulse mb-2"></div>
                <div class="h-3 w-4/5 bg-surface-light rounded animate-pulse mb-6"></div>
                <div class="flex gap-2 mb-4">
                  <div class="h-4 w-16 bg-surface-light rounded-full animate-pulse"></div>
                  <div class="h-4 w-12 bg-surface-light rounded-full animate-pulse"></div>
                </div>
                <div class="h-8 w-24 bg-surface-light rounded animate-pulse"></div>
              </div>
            }
          </div>
        }

        <!-- Error -->
        @if (error()) {
          <div class="max-w-2xl mx-auto text-center py-12 px-6 rounded-2xl bg-surface/70 border border-violet-primary/20 backdrop-blur-sm">
            <div class="w-12 h-12 rounded-full bg-violet-primary/10 border border-violet-primary/30 mx-auto mb-4 flex items-center justify-center">
              <svg class="w-6 h-6 text-violet-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"/>
              </svg>
            </div>

            <h3 class="text-xl font-semibold text-text-primary mb-2">{{ i18n.t('projects.errorTitle') }}</h3>
            <p class="text-text-muted">{{ errorHint() }}</p>
            <p class="text-text-muted/80 text-sm mt-2 break-words">{{ error() }}</p>

            <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button (click)="retry()"
                      class="px-5 py-2.5 text-sm text-violet-primary border border-violet-primary/30 rounded-lg hover:bg-violet-primary/10 transition-colors">
                {{ i18n.t('projects.retry') }}
              </button>

              <a href="https://github.com/K-Forge" target="_blank" rel="noopener"
                 class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-violet-primary/40 bg-violet-primary/15 text-violet-glow hover:bg-violet-primary/25 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
                </svg>
                {{ i18n.t('projects.errorCta') }}
              </a>
            </div>
          </div>
        }

        <!-- Projects Grid -->
        @if (!loading() && !error()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (repo of repos(); track repo.id; let i = $index) {
              <div class="project-card group p-6 rounded-2xl bg-surface border border-surface-light 
                          hover:border-violet-primary/40 transition-all duration-500 
                          hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] flex flex-col h-full"
                   appFadeIn="up" [fadeDelay]="i * 80">
                
                <div class="project-title flex items-start justify-between my-[6px]">
                  <h3 class="text-lg font-semibold text-text-primary group-hover:text-violet-primary 
                             transition-colors truncate pr-2">
                    {{ repo.name }}
                  </h3>
                  <svg class="w-4 h-4 text-text-muted/40 group-hover:text-violet-primary/60 
                              transition-colors flex-shrink-0 mt-1" 
                       fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
                  </svg>
                </div>

                <div class="project-about flex-1 flex flex-col justify-evenly my-[6px]">
                  <div class="project-description my-[6px]">
                    <p class="text-text-muted text-sm line-clamp-2 min-h-[40px]">
                      {{ repo.description || i18n.t('projects.noDesc') }}
                    </p>
                  </div>

                  <div class="project-topics my-[6px]">
                    @if (repo.topics && repo.topics.length > 0) {
                      <div class="flex flex-wrap gap-1.5">
                        @for (topic of repo.topics.slice(0, 6); track topic) {
                          <span class="px-2 py-0.5 text-[10px] font-medium text-violet-glow bg-violet-primary/10 
                                       rounded-full border border-violet-primary/20">
                            {{ topic }}
                          </span>
                        }
                      </div>
                    }
                  </div>
                </div>

                <div class="project-technologies my-[6px] flex items-center gap-3">
                  @if (repo.language) {
                    <div class="flex items-center gap-1.5">
                      <span class="w-2.5 h-2.5 rounded-full" 
                            [style.background-color]="githubService.getLanguageColor(repo.language)"></span>
                      <span class="text-xs text-text-muted">{{ repo.language }}</span>
                    </div>
                  }
                  <div class="flex items-center gap-1 text-text-muted/60 text-xs">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {{ repo.stargazers_count }}
                  </div>
                </div>

                <!-- Links -->
                <div class="project-actions flex items-center gap-4 my-[6px]">
                  <!-- GitHub Link -->
                  <a [href]="repo.html_url" target="_blank" rel="noopener"
                     class="inline-flex items-center gap-1.5 text-violet-primary text-sm font-medium 
                            hover:text-violet-glow transition-colors"
                     (click)="$event.stopPropagation()">
                    <span class="hidden sm:inline">{{ i18n.t('projects.viewCode') }}</span>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>

                  <!-- Live Demo Link -->
                  @if (repo.homepage) {
                    <a [href]="repo.homepage" target="_blank" rel="noopener"
                       class="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium 
                              hover:text-emerald-300 transition-colors ml-auto"
                       (click)="$event.stopPropagation()">
                      <span>{{ i18n.t('projects.viewLive') }}</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </a>
                  }
                </div>
              </div>
            } @empty {
              <div class="col-span-full text-center py-12">
                <p class="text-text-muted">{{ i18n.t('projects.empty') }}</p>
              </div>
            }
          </div>
        }

        <!-- CTA -->
        <div class="text-center mt-16" appFadeIn="up">
          @if (error()) {
            <a href="https://github.com/K-Forge" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 px-6 py-3 border border-violet-primary/50 bg-violet-primary/15
                      text-violet-glow font-semibold rounded-xl hover:bg-violet-primary/25 transition-all duration-300 text-sm shadow-[0_0_28px_rgba(139,92,246,0.22)]">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
              </svg>
              {{ i18n.t('projects.errorCta') }}
            </a>
          } @else {
            <a href="https://github.com/K-Forge" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 px-6 py-3 border border-surface-light 
                      text-text-muted font-medium rounded-xl hover:border-violet-primary/50 
                      hover:text-violet-primary transition-all duration-300 text-sm">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
              </svg>
              {{ i18n.t('projects.viewMore') }}
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── Forge Grid Traces ── */
    .forge-trace {
      stroke: rgba(139, 92, 246, 0.2);
      stroke-dasharray: 60 500;
      stroke-linecap: round;
    }
    .forge-t1 { animation: forge-flow 9s linear infinite; }
    .forge-t2 { animation: forge-flow 11s linear infinite; animation-delay: -3s; }
    .forge-t3 { animation: forge-flow 8s linear infinite; animation-delay: -6s; }
    .forge-t4 { animation: forge-flow 10s linear infinite; animation-delay: -1s; }
    .forge-t5 { animation: forge-flow 7s linear infinite; animation-delay: -4s; }
    .forge-t6 { animation: forge-flow 9.5s linear infinite; animation-delay: -7s; }

    @keyframes forge-flow {
      0%   { stroke-dashoffset: 560;  stroke: rgba(139,92,246, 0.06); }
      35%  { stroke: rgba(139,92,246, 0.4); }
      65%  { stroke: rgba(167,139,250, 0.35); }
      100% { stroke-dashoffset: -560; stroke: rgba(139,92,246, 0.06); }
    }

    /* ── Forge Junction Nodes ── */
    .forge-node {
      fill: rgba(139, 92, 246, 0.12);
    }
    .fn-1 { animation: fn-pulse 5s ease-in-out infinite; }
    .fn-2 { animation: fn-pulse 4.5s ease-in-out infinite; animation-delay: -1s; }
    .fn-3 { animation: fn-pulse 6s ease-in-out infinite; animation-delay: -2s; }
    .fn-4 { animation: fn-pulse 5.5s ease-in-out infinite; animation-delay: -3s; }
    .fn-5 { animation: fn-pulse 4s ease-in-out infinite; animation-delay: -0.5s; }
    .fn-6 { animation: fn-pulse 5s ease-in-out infinite; animation-delay: -4s; }

    @keyframes fn-pulse {
      0%, 100% { fill: rgba(139,92,246, 0.08); r: 2; }
      50%      { fill: rgba(139,92,246, 0.45); r: 4; }
    }

  `]
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  i18n = inject(I18nService);
  githubService = inject(GithubService);
  private ngZone = inject(NgZone);

  @ViewChild('hammerCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  repos = this.githubService.repos;
  loading = this.githubService.loading;
  error = this.githubService.error;
  skeletons = Array.from({ length: 4 });

  private animId = 0;
  private hammerPairs: HammerPair[] = [];

  ngOnInit(): void {
    this.githubService.fetchRepos();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => this.initCanvas());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  retry(): void {
    this.githubService.fetchRepos();
  }

  errorHint(): string {
    const currentError = this.error();
    if (!currentError) return this.i18n.t('projects.errorUnavailable');

    const rateLimitPattern = /(403|rate limit|api rate limit exceeded)/i;
    return rateLimitPattern.test(currentError)
      ? this.i18n.t('projects.errorRateLimit')
      : this.i18n.t('projects.errorUnavailable');
  }

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width / devicePixelRatio;
    const H = () => canvas.height / devicePixelRatio;

    // Single hammer pair
    this.hammerPairs = [createHammerPair(W(), H(), 0)];

    const loop = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      for (const pair of this.hammerPairs) {
        updateHammerPair(pair, w, h);
        drawHammerPair(ctx, pair);
      }

      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }
}

/* ═══ DATA STRUCTURES ═══ */
interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  color: string;
}

interface HammerPair {
  cx: number; cy: number;       // collision point
  phase: number;                 // 0..1 lifecycle
  speed: number;                 // phase increment per frame
  scale: number;
  sparks: Spark[];
  flashAlpha: number;
  flashRadius: number;
  spawned: boolean;              // whether sparks were spawned this cycle
}

/*
  LIFECYCLE (phase 0→1)  ~3s total at 60fps ≈ 180 frames
  0.00–0.15  fade in slowly, hammers apart
  0.15–0.42  hammers glide inward (heads approaching)
  0.42–0.48  IMPACT — heads collide, spark burst
  0.48–0.65  gentle bounce back + sparks
  0.65–0.82  fade out slowly
  0.82–1.00  invisible pause → teleport to new position
*/

const SPARK_COLORS = ['#fde68a', '#fbbf24', '#f59e0b', '#c084fc', '#a78bfa', '#fff7ed'];

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

// ~3s cycle: 1/180 ≈ 0.0056 per frame
function createHammerPair(w: number, h: number, _index: number): HammerPair {
  const margin = 160;
  return {
    cx: rand(margin, w - margin),
    cy: rand(margin, h - margin),
    phase: 0,
    speed: 1 / 180,  // exactly ~3 seconds at 60fps
    scale: rand(1.1, 1.5),
    sparks: [],
    flashAlpha: 0,
    flashRadius: 0,
    spawned: false,
  };
}

function teleportPair(p: HammerPair, w: number, h: number): void {
  const margin = 160;
  p.cx = rand(margin, w - margin);
  p.cy = rand(margin, h - margin);
  p.scale = rand(1.1, 1.5);
  p.spawned = false;
}

function updateHammerPair(p: HammerPair, w: number, h: number): void {
  p.phase += p.speed;
  if (p.phase >= 1) {
    p.phase -= 1;
    teleportPair(p, w, h);
  }

  // Spawn sparks at impact (phase ~0.42)
  if (p.phase >= 0.42 && p.phase < 0.48 && !p.spawned) {
    p.spawned = true;
    for (let i = 0; i < 14; i++) {
      const angle = rand(0, Math.PI * 2);
      const spd = rand(2, 6.5);
      p.sparks.push({
        x: p.cx, y: p.cy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - rand(0.5, 2.5),
        life: 1,
        maxLife: rand(0.4, 1),
        size: rand(1.5, 4.5),
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      });
    }
    p.flashAlpha = 1;
    p.flashRadius = 8 * p.scale;
  }

  // Update sparks
  for (let i = p.sparks.length - 1; i >= 0; i--) {
    const s = p.sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.08;   // gravity
    s.vx *= 0.98;
    s.life -= 0.022 / s.maxLife;
    if (s.life <= 0) p.sparks.splice(i, 1);
  }

  // Decay flash
  if (p.flashAlpha > 0) {
    p.flashAlpha *= 0.85;
    p.flashRadius += 2;
    if (p.flashAlpha < 0.01) p.flashAlpha = 0;
  }
}

function drawHammerPair(ctx: CanvasRenderingContext2D, p: HammerPair): void {
  const { cx, cy, phase, scale: s } = p;

  // Slow fade in/out: 0–0.15 in, 0.15–0.65 full, 0.65–0.82 out, 0.82–1 invisible
  let alpha: number;
  if (phase < 0.15) {
    alpha = phase / 0.15;
    alpha = alpha * alpha; // ease-in (slow start)
  } else if (phase < 0.65) {
    alpha = 1;
  } else if (phase < 0.82) {
    const t = 1 - (phase - 0.65) / 0.17;
    alpha = t * t; // ease-out (slow end)
  } else {
    alpha = 0;
  }
  alpha *= 0.45; // overall subtlety

  if (alpha < 0.005 && p.sparks.length === 0 && p.flashAlpha < 0.01) return;

  // Gap between heads: large → 0 at impact → bounces back
  const HEAD_W = 26 * s;
  const HANDLE_W = 60 * s;
  let gap: number;     // distance from center to each head's inner face
  let swingAngle: number;

  if (phase < 0.15) {
    // Fade in — spread apart
    gap = (70 + 15 * (1 - phase / 0.15)) * s;
    swingAngle = -12;
  } else if (phase < 0.42) {
    // Approach — heads glide toward each other (smooth)
    const t = (phase - 0.15) / 0.27;
    const ease = t * t * (3 - 2 * t);
    gap = (70 - 70 * ease) * s;
    swingAngle = -12 + 17 * ease;
  } else if (phase < 0.48) {
    // Impact — heads touching
    gap = 0;
    swingAngle = 5;
  } else if (phase < 0.65) {
    // Bounce back gently
    const t = (phase - 0.48) / 0.17;
    const ease = t * t;
    gap = 45 * ease * s;
    swingAngle = 5 - 17 * ease;
  } else {
    // Holding apart, fading
    gap = 45 * s;
    swingAngle = -12;
  }

  ctx.save();

  // ── Draw left hammer (head on RIGHT side, facing center) ──
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx - gap - HEAD_W, cy);
  ctx.rotate((swingAngle * Math.PI) / 180);
  drawHammer(ctx, s, 'right'); // head faces right (toward center)
  ctx.restore();

  // ── Draw right hammer (head on LEFT side, facing center) ──
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx + gap + HEAD_W, cy);
  ctx.rotate((-swingAngle * Math.PI) / 180);
  drawHammer(ctx, s, 'left'); // head faces left (toward center)
  ctx.restore();

  // ── Draw flash ──
  if (p.flashAlpha > 0.01) {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, p.flashRadius);
    grad.addColorStop(0, `rgba(251, 191, 36, ${p.flashAlpha})`);
    grad.addColorStop(0.3, `rgba(245, 158, 11, ${p.flashAlpha * 0.7})`);
    grad.addColorStop(0.6, `rgba(139, 92, 246, ${p.flashAlpha * 0.3})`);
    grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, p.flashRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Draw sparks ──
  for (const sp of p.sparks) {
    ctx.save();
    ctx.globalAlpha = Math.min(sp.life * 0.95, 1);
    ctx.shadowColor = sp.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = sp.color;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.size * Math.max(sp.life, 0.2), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draw a single hammer at origin.
 * headDir: 'left' = head on left, handle on right.
 *          'right' = head on right, handle on left.
 */
function drawHammer(ctx: CanvasRenderingContext2D, s: number, headDir: 'left' | 'right'): void {
  const handleW = 60 * s, handleH = 8 * s;
  const headW = 26 * s, headH = 36 * s;

  ctx.shadowColor = '#8B5CF6';
  ctx.shadowBlur = 14;

  const isRight = headDir === 'right';

  // Handle: extends away from center (opposite side of head)
  const hGrad = ctx.createLinearGradient(
    isRight ? -handleW : 0, 0,
    isRight ? 0 : handleW, 0
  );
  hGrad.addColorStop(0, '#7C3AED');
  hGrad.addColorStop(1, '#A78BFA');
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  roundRect(ctx,
    isRight ? -handleW : 0,
    -handleH / 2,
    handleW, handleH, 3 * s
  );
  ctx.fill();

  // Head: on the specified side
  const headGrad = ctx.createLinearGradient(
    isRight ? 0 : -headW, -headH / 2,
    isRight ? headW : 0, headH / 2
  );
  headGrad.addColorStop(0, '#C4B5FD');
  headGrad.addColorStop(0.4, '#8B5CF6');
  headGrad.addColorStop(1, '#5B21B6');
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  roundRect(ctx,
    isRight ? -2 * s : -headW + 2 * s,
    -headH / 2,
    headW, headH, 5 * s
  );
  ctx.fill();

  // Head shine
  ctx.fillStyle = 'rgba(196, 181, 253, 0.3)';
  ctx.beginPath();
  roundRect(ctx,
    isRight ? headW - 7 * s : -headW + 3 * s,
    -headH / 2 + 4 * s,
    4 * s, headH - 8 * s, 2 * s
  );
  ctx.fill();

  ctx.shadowBlur = 0;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
