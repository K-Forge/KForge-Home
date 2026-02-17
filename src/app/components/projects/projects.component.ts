import { Component, OnInit, inject } from '@angular/core';
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

      <!-- ═══ ANIMATED HAMMERS + SPARKS ═══ -->
      <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg class="w-full h-full max-w-[600px] max-h-[600px] opacity-[0.18] md:opacity-[0.14]"
             viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hammer-left-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#A78BFA"/>
              <stop offset="100%" stop-color="#6D28D9"/>
            </linearGradient>
            <linearGradient id="hammer-right-grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#A78BFA"/>
              <stop offset="100%" stop-color="#6D28D9"/>
            </linearGradient>
            <filter id="hammer-glow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="big-spark-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="4"/>
            </filter>
          </defs>

          <!-- LEFT HAMMER (swings from left) -->
          <g class="hammer-left" filter="url(#hammer-glow)">
            <!-- Handle -->
            <rect x="80" y="190" width="90" height="12" rx="3" fill="url(#hammer-left-grad)" opacity="0.7"/>
            <!-- Head -->
            <rect x="50" y="172" width="38" height="48" rx="5" fill="url(#hammer-left-grad)" opacity="0.9"/>
            <!-- Head highlight -->
            <rect x="52" y="175" width="8" height="42" rx="3" fill="#C4B5FD" opacity="0.3"/>
          </g>

          <!-- RIGHT HAMMER (swings from right) -->
          <g class="hammer-right" filter="url(#hammer-glow)">
            <!-- Handle -->
            <rect x="230" y="190" width="90" height="12" rx="3" fill="url(#hammer-right-grad)" opacity="0.7"/>
            <!-- Head -->
            <rect x="312" y="172" width="38" height="48" rx="5" fill="url(#hammer-right-grad)" opacity="0.9"/>
            <!-- Head highlight -->
            <rect x="340" y="175" width="8" height="42" rx="3" fill="#C4B5FD" opacity="0.3"/>
          </g>

          <!-- ═══ SPARK PARTICLES AT COLLISION POINT ═══ -->
          <g class="sparks-group">
            <!-- Central flash -->
            <circle cx="200" cy="196" r="8" fill="#fbbf24" opacity="0" class="spark-flash"/>
            <circle cx="200" cy="196" r="16" fill="#fbbf24" opacity="0" class="spark-flash-outer" filter="url(#big-spark-glow)"/>
            
            <!-- Spark particles flying outward -->
            <circle cx="200" cy="196" r="2.5" fill="#fde68a" class="spark s1"/>
            <circle cx="200" cy="196" r="2" fill="#fbbf24" class="spark s2"/>
            <circle cx="200" cy="196" r="1.8" fill="#f59e0b" class="spark s3"/>
            <circle cx="200" cy="196" r="2.2" fill="#fde68a" class="spark s4"/>
            <circle cx="200" cy="196" r="1.5" fill="#fbbf24" class="spark s5"/>
            <circle cx="200" cy="196" r="2" fill="#c084fc" class="spark s6"/>
            <circle cx="200" cy="196" r="1.8" fill="#fde68a" class="spark s7"/>
            <circle cx="200" cy="196" r="2.5" fill="#f59e0b" class="spark s8"/>
            <circle cx="200" cy="196" r="1.5" fill="#c084fc" class="spark s9"/>
            <circle cx="200" cy="196" r="2" fill="#fbbf24" class="spark s10"/>
            <circle cx="200" cy="196" r="1.8" fill="#fde68a" class="spark s11"/>
            <circle cx="200" cy="196" r="2.2" fill="#f59e0b" class="spark s12"/>
          </g>
        </svg>
      </div>

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
          <div class="text-center py-16">
            <div class="text-red-400/80 text-lg mb-2">{{ i18n.t('projects.error') }}</div>
            <p class="text-text-muted text-sm">{{ error() }}</p>
            <button (click)="retry()" 
                    class="mt-6 px-5 py-2.5 text-sm text-violet-primary border border-violet-primary/30 
                           rounded-lg hover:bg-violet-primary/10 transition-colors">
              {{ i18n.t('projects.retry') }}
            </button>
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
          <a href="https://github.com/K-Forge" target="_blank" rel="noopener"
             class="inline-flex items-center gap-2 px-6 py-3 border border-surface-light 
                    text-text-muted font-medium rounded-xl hover:border-violet-primary/50 
                    hover:text-violet-primary transition-all duration-300 text-sm">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
            </svg>
            {{ i18n.t('projects.viewMore') }}
          </a>
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

    /* ══════════════════════════════════════════
       HAMMER SWING + COLLISION ANIMATION
       Total cycle: 3s
       0%-40%   hammers swing inward
       40%-50%  IMPACT (hold + sparks)
       50%-75%  hammers bounce back
       75%-100% rest before repeat
       ══════════════════════════════════════════ */

    .hammer-left {
      transform-origin: 170px 196px;
      animation: swing-left 3s ease-in-out infinite;
    }
    .hammer-right {
      transform-origin: 230px 196px;
      animation: swing-right 3s ease-in-out infinite;
    }

    @keyframes swing-left {
      0%   { transform: rotate(-35deg) translateX(-20px); }
      40%  { transform: rotate(8deg) translateX(10px); }
      50%  { transform: rotate(5deg) translateX(8px); }
      75%  { transform: rotate(-35deg) translateX(-20px); }
      100% { transform: rotate(-35deg) translateX(-20px); }
    }

    @keyframes swing-right {
      0%   { transform: rotate(35deg) translateX(20px); }
      40%  { transform: rotate(-8deg) translateX(-10px); }
      50%  { transform: rotate(-5deg) translateX(-8px); }
      75%  { transform: rotate(35deg) translateX(20px); }
      100% { transform: rotate(35deg) translateX(20px); }
    }

    /* ── Central flash on impact ── */
    .spark-flash {
      animation: flash-core 3s ease-out infinite;
    }
    .spark-flash-outer {
      animation: flash-outer 3s ease-out infinite;
    }

    @keyframes flash-core {
      0%, 35%  { opacity: 0; r: 4; }
      40%      { opacity: 1; r: 12; }
      55%      { opacity: 0.3; r: 6; }
      65%, 100% { opacity: 0; r: 4; }
    }
    @keyframes flash-outer {
      0%, 35%  { opacity: 0; r: 8; }
      40%      { opacity: 0.6; r: 28; }
      55%      { opacity: 0.1; r: 14; }
      65%, 100% { opacity: 0; r: 8; }
    }

    /* ── Spark Particles ── */
    .spark {
      opacity: 0;
    }
    .s1  { animation: spark-fly 3s ease-out infinite; --sx: -40px; --sy: -50px; }
    .s2  { animation: spark-fly 3s ease-out infinite; --sx: 35px;  --sy: -45px; }
    .s3  { animation: spark-fly 3s ease-out infinite; --sx: -50px; --sy: -20px; }
    .s4  { animation: spark-fly 3s ease-out infinite; --sx: 55px;  --sy: -25px; }
    .s5  { animation: spark-fly 3s ease-out infinite; --sx: -30px; --sy: -60px; }
    .s6  { animation: spark-fly 3s ease-out infinite; --sx: 45px;  --sy: -55px; }
    .s7  { animation: spark-fly 3s ease-out infinite; --sx: -60px; --sy: 10px; }
    .s8  { animation: spark-fly 3s ease-out infinite; --sx: 60px;  --sy: 5px; }
    .s9  { animation: spark-fly 3s ease-out infinite; --sx: -20px; --sy: -65px; }
    .s10 { animation: spark-fly 3s ease-out infinite; --sx: 25px;  --sy: 15px; }
    .s11 { animation: spark-fly 3s ease-out infinite; --sx: -55px; --sy: -35px; }
    .s12 { animation: spark-fly 3s ease-out infinite; --sx: 50px;  --sy: -40px; }

    @keyframes spark-fly {
      0%, 38% {
        opacity: 0;
        transform: translate(0, 0) scale(1);
      }
      42% {
        opacity: 1;
        transform: translate(0, 0) scale(1.3);
      }
      70% {
        opacity: 0.6;
        transform: translate(var(--sx), var(--sy)) scale(0.8);
      }
      85%, 100% {
        opacity: 0;
        transform: translate(calc(var(--sx) * 1.5), calc(var(--sy) * 1.5)) scale(0);
      }
    }
  `]
})
export class ProjectsComponent implements OnInit {
  i18n = inject(I18nService);
  githubService = inject(GithubService);


  repos = this.githubService.repos;
  loading = this.githubService.loading;
  error = this.githubService.error;

  skeletons = Array.from({ length: 4 });

  ngOnInit(): void {
    this.githubService.fetchRepos();
  }

  retry(): void {
    this.githubService.fetchRepos();
  }
}
