import {
  Component, OnInit, AfterViewInit, OnDestroy,
  inject, ElementRef, ViewChild, NgZone, ChangeDetectionStrategy,
} from '@angular/core';
import { GithubService } from '../../services/github.service';
import { GithubIconComponent } from '../../shared/github-icon.component';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { ApiErrorComponent } from '../../shared/api-error.component';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FadeInDirective, GithubIconComponent, SectionHeaderComponent, ApiErrorComponent],
  template: `
    <section id="projects" class="relative px-6 py-20 md:py-24 bg-midnight min-h-screen flex items-center overflow-hidden">

      <!-- ═══ GRADIENT BASE ═══ -->
      <div class="absolute inset-0 bg-gradient-to-b from-midnight via-surface to-midnight"></div>

      <!-- ═══ FORGE GRID (reduced: 3 traces + 3 nodes on desktop, hidden on mobile) ═══ -->
      <div class="absolute inset-0 overflow-hidden hidden md:block" aria-hidden="true">
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="forge-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Static dim forge grid -->
          <g class="opacity-[0.05]" stroke="rgba(139,92,246,1)" stroke-width="0.8" fill="none">
            <path d="M0,200 H400 L450,150 H750 L800,200 H1200"/>
            <path d="M0,400 H300 L350,350 H850 L900,400 H1200"/>
            <path d="M0,600 H500 L550,550 H700 L750,600 H1200"/>
          </g>

          <!-- Animated forge traces (reduced from 6 to 3) -->
          <g fill="none" stroke-width="1.2" filter="url(#forge-glow)">
            <path d="M0,200 H400 L450,150 H750 L800,200 H1200" class="forge-trace forge-t1"/>
            <path d="M0,400 H300 L350,350 H850 L900,400 H1200" class="forge-trace forge-t2"/>
            <path d="M0,600 H500 L550,550 H700 L750,600 H1200" class="forge-trace forge-t3"/>
          </g>

          <!-- Junction nodes (reduced from 6 to 3) -->
          <g>
            <circle cx="400" cy="200" r="2" class="forge-node fn-1"/>
            <circle cx="350" cy="350" r="2" class="forge-node fn-2"/>
            <circle cx="550" cy="550" r="2" class="forge-node fn-3"/>
          </g>
        </svg>
      </div>

      <!-- ═══ ANIMATED HAMMERS (Canvas — desktop only) ═══ -->
      <canvas #hammerCanvas
              class="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
              style="z-index: 1;"
              aria-hidden="true"></canvas>

      <!-- ═══ GLOW BLOBS (reduced from 4 to 2, smaller blur on mobile) ═══ -->
      <div class="absolute top-1/4 right-1/4 w-[300px] md:w-[450px] h-[300px] md:h-[450px]
                  bg-violet-primary/[0.06] rounded-full blur-[80px] md:blur-[160px] animate-pulse-glow"
           aria-hidden="true"></div>
      <div class="absolute bottom-1/4 left-1/4 w-[250px] md:w-[350px] h-[250px] md:h-[350px]
                  bg-violet-deep/[0.05] rounded-full blur-[80px] md:blur-[140px] animate-pulse-glow"
           style="animation-delay: 2s;" aria-hidden="true"></div>

      <!-- ═══ CONTENT ═══ -->
      <div class="relative z-10 max-w-7xl mx-auto w-full">

        <!-- Section Header -->
        <app-section-header
          [title]="i18n.t('projects.title')"
          [subtitle]="i18n.t('projects.subtitle')" />

        <!-- Loading Skeleton -->
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (i of skeletonSlots; track i) {
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
          <app-api-error
            [errorMessage]="error()!"
            [errorTitle]="i18n.t('projects.errorTitle')"
            [errorHint]="githubService.getErrorHint(error(), 'projects')"
            [retryLabel]="i18n.t('projects.retry')"
            [ctaLabel]="i18n.t('projects.errorCta')"
            ctaUrl="https://github.com/K-Forge"
            (retryClicked)="retry()" />
        }

        <!-- Projects Grid -->
        @if (!loading() && !error()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (repo of repos(); track repo.id; let i = $index) {
              <div class="project-card group p-6 rounded-2xl bg-surface border border-surface-light
                          hover:border-violet-primary/40 transition-all duration-500
                          hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] flex flex-col h-full"
                   appFadeIn="up" [fadeDelay]="i * 80">

                <!-- Title row -->
                <div class="flex items-start justify-between my-[6px]">
                  <h3 class="text-lg font-semibold text-text-primary group-hover:text-violet-primary
                             transition-colors truncate pr-2">
                    {{ repo.name }}
                  </h3>
                  <github-icon class="text-text-muted/40 group-hover:text-violet-primary/60
                                      transition-colors flex-shrink-0 mt-1" [size]="16" />
                </div>

                <!-- Description + Topics -->
                <div class="flex-1 flex flex-col justify-evenly my-[6px]">
                  <p class="text-text-muted text-sm line-clamp-2 min-h-[40px] my-[6px]">
                    {{ repo.description || i18n.t('projects.noDesc') }}
                  </p>

                  @if (repo.topics && repo.topics.length > 0) {
                    <div class="flex flex-wrap gap-1.5 my-[6px]">
                      @for (topic of repo.topics.slice(0, 6); track topic) {
                        <span class="px-2 py-0.5 text-[10px] font-medium text-violet-glow bg-violet-primary/10
                                     rounded-full border border-violet-primary/20">
                          {{ topic }}
                        </span>
                      }
                    </div>
                  }
                </div>

                <!-- Language + Stars -->
                <div class="flex items-center gap-3 my-[6px]">
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

                <!-- Action Links -->
                <div class="flex items-center gap-4 my-[6px]">
                  <a [href]="repo.html_url" target="_blank" rel="noopener"
                     class="inline-flex items-center gap-1.5 text-violet-primary text-sm font-medium
                            hover:text-violet-glow transition-colors"
                     (click)="$event.stopPropagation()">
                    <span class="hidden sm:inline">{{ i18n.t('projects.viewCode') }}</span>
                    <github-icon [size]="16" />
                  </a>

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
             class="inline-flex items-center gap-2 px-6 py-3 border text-sm font-medium rounded-xl transition-all duration-300"
             [class]="error()
               ? 'border-violet-primary/50 bg-violet-primary/15 text-violet-glow font-semibold shadow-[0_0_28px_rgba(139,92,246,0.22)] hover:bg-violet-primary/25'
               : 'border-surface-light text-text-muted hover:border-violet-primary/50 hover:text-violet-primary'">
            <github-icon [size]="20" />
            {{ error() ? i18n.t('projects.errorCta') : i18n.t('projects.viewMore') }}
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── Forge Grid Traces (reduced to 3) ── */
    .forge-trace {
      stroke: rgba(139, 92, 246, 0.2);
      stroke-dasharray: 60 500;
      stroke-linecap: round;
    }
    .forge-t1 { animation: forge-flow 9s linear infinite; }
    .forge-t2 { animation: forge-flow 11s linear infinite; animation-delay: -3s; }
    .forge-t3 { animation: forge-flow 8s linear infinite; animation-delay: -6s; }

    @keyframes forge-flow {
      0%   { stroke-dashoffset: 560;  stroke: rgba(139,92,246, 0.06); }
      35%  { stroke: rgba(139,92,246, 0.4); }
      65%  { stroke: rgba(167,139,250, 0.35); }
      100% { stroke-dashoffset: -560; stroke: rgba(139,92,246, 0.06); }
    }

    /* ── Junction Nodes (reduced to 3) ── */
    .forge-node { fill: rgba(139, 92, 246, 0.12); }
    .fn-1 { animation: fn-pulse 5s ease-in-out infinite; }
    .fn-2 { animation: fn-pulse 6s ease-in-out infinite; animation-delay: -2s; }
    .fn-3 { animation: fn-pulse 4.5s ease-in-out infinite; animation-delay: -4s; }

    @keyframes fn-pulse {
      0%, 100% { fill: rgba(139,92,246, 0.08); r: 2; }
      50%      { fill: rgba(139,92,246, 0.45); r: 4; }
    }
  `]
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly i18n = inject(I18nService);
  readonly githubService = inject(GithubService);
  private readonly ngZone = inject(NgZone);

  @ViewChild('hammerCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Expose service signals to template */
  readonly repos = this.githubService.repos;
  readonly loading = this.githubService.loading;
  readonly error = this.githubService.error;
  readonly skeletonSlots = Array.from({ length: 4 }, (_, i) => i);

  /** Canvas animation state */
  private canvasAnimationId = 0;
  private activeHammerPairs: HammerPair[] = [];
  private isCanvasVisible = false;
  private canvasVisibilityObserver?: IntersectionObserver;
  private resizeHandler?: () => void;

  /** Skip canvas entirely on mobile for performance */
  private readonly isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  ngOnInit(): void {
    this.githubService.fetchRepos();
  }

  ngAfterViewInit(): void {
    if (!this.isMobile) {
      this.ngZone.runOutsideAngular(() => this.initCanvas());
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.canvasAnimationId);
    this.canvasVisibilityObserver?.disconnect();

    // Clean up resize listener
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  retry(): void {
    this.githubService.fetchRepos();
  }

  /* ═══ CANVAS SETUP ═══ */

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Resize handler (stored for cleanup) ──
    this.resizeHandler = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);

    const getWidth = () => canvas.width / devicePixelRatio;
    const getHeight = () => canvas.height / devicePixelRatio;

    this.activeHammerPairs = [createHammerPair(getWidth(), getHeight())];

    // ── Animation loop ──
    const loop = () => {
      if (!this.isCanvasVisible) {
        // Paused — just schedule next check, don't draw
        this.canvasAnimationId = requestAnimationFrame(loop);
        return;
      }

      const w = getWidth();
      const h = getHeight();
      ctx.clearRect(0, 0, w, h);

      for (const pair of this.activeHammerPairs) {
        updateHammerPair(pair, w, h);
        drawHammerPair(ctx, pair);
      }

      this.canvasAnimationId = requestAnimationFrame(loop);
    };
    this.canvasAnimationId = requestAnimationFrame(loop);

    // ── Pause canvas when section is off-screen ──
    this.canvasVisibilityObserver = new IntersectionObserver(
      ([entry]) => { this.isCanvasVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    const section = canvas.closest('section');
    if (section) this.canvasVisibilityObserver.observe(section);
  }
}


/* ═══════════════════════════════════════════════════
   CANVAS ANIMATION — Hammer Pair with Sparks
   ═══════════════════════════════════════════════════ */

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  color: string;
}

interface HammerPair {
  cx: number; cy: number;
  phase: number;
  speed: number;
  scale: number;
  sparks: Spark[];
  flashAlpha: number;
  flashRadius: number;
  hasSpawned: boolean;
}

/*
  LIFECYCLE (phase 0→1, ~3s at 60fps ≈ 180 frames)
  0.00–0.15  fade in, hammers apart
  0.15–0.42  hammers glide inward
  0.42–0.48  IMPACT — spark burst
  0.48–0.65  bounce back + sparks
  0.65–0.82  fade out
  0.82–1.00  invisible pause → teleport
*/

const SPARK_COLORS = ['#fde68a', '#fbbf24', '#f59e0b', '#c084fc', '#a78bfa', '#fff7ed'];

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function createHammerPair(w: number, h: number): HammerPair {
  const margin = 160;
  return {
    cx: rand(margin, w - margin),
    cy: rand(margin, h - margin),
    phase: 0,
    speed: 1 / 180,
    scale: rand(1.1, 1.5),
    sparks: [],
    flashAlpha: 0,
    flashRadius: 0,
    hasSpawned: false,
  };
}

function teleportPair(pair: HammerPair, w: number, h: number): void {
  const margin = 160;
  pair.cx = rand(margin, w - margin);
  pair.cy = rand(margin, h - margin);
  pair.scale = rand(1.1, 1.5);
  pair.hasSpawned = false;
}

function updateHammerPair(pair: HammerPair, w: number, h: number): void {
  pair.phase += pair.speed;
  if (pair.phase >= 1) {
    pair.phase -= 1;
    teleportPair(pair, w, h);
  }

  // Spawn sparks at impact frame
  if (pair.phase >= 0.42 && pair.phase < 0.48 && !pair.hasSpawned) {
    pair.hasSpawned = true;
    const sparkCount = 10; // reduced from 14 for performance
    for (let i = 0; i < sparkCount; i++) {
      const angle = rand(0, Math.PI * 2);
      const spd = rand(2, 5.5);
      pair.sparks.push({
        x: pair.cx, y: pair.cy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - rand(0.5, 2),
        life: 1,
        maxLife: rand(0.4, 1),
        size: rand(1.5, 3.5),
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      });
    }
    pair.flashAlpha = 1;
    pair.flashRadius = 8 * pair.scale;
  }

  // Update sparks (iterate backwards for safe removal)
  for (let i = pair.sparks.length - 1; i >= 0; i--) {
    const spark = pair.sparks[i];
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vy += 0.08;
    spark.vx *= 0.98;
    spark.life -= 0.022 / spark.maxLife;
    if (spark.life <= 0) pair.sparks.splice(i, 1);
  }

  // Decay flash
  if (pair.flashAlpha > 0) {
    pair.flashAlpha *= 0.85;
    pair.flashRadius += 2;
    if (pair.flashAlpha < 0.01) pair.flashAlpha = 0;
  }
}

function drawHammerPair(ctx: CanvasRenderingContext2D, pair: HammerPair): void {
  const { cx, cy, phase, scale } = pair;

  // Compute opacity (fade in/out)
  let alpha: number;
  if (phase < 0.15) {
    const t = phase / 0.15;
    alpha = t * t;
  } else if (phase < 0.65) {
    alpha = 1;
  } else if (phase < 0.82) {
    const t = 1 - (phase - 0.65) / 0.17;
    alpha = t * t;
  } else {
    alpha = 0;
  }
  alpha *= 0.45;

  if (alpha < 0.005 && pair.sparks.length === 0 && pair.flashAlpha < 0.01) return;

  // Compute gap between hammer heads
  const headWidth = 26 * scale;
  let gap: number;
  let swingAngle: number;

  if (phase < 0.15) {
    gap = (70 + 15 * (1 - phase / 0.15)) * scale;
    swingAngle = -12;
  } else if (phase < 0.42) {
    const t = (phase - 0.15) / 0.27;
    const ease = t * t * (3 - 2 * t);
    gap = (70 - 70 * ease) * scale;
    swingAngle = -12 + 17 * ease;
  } else if (phase < 0.48) {
    gap = 0;
    swingAngle = 5;
  } else if (phase < 0.65) {
    const t = (phase - 0.48) / 0.17;
    const ease = t * t;
    gap = 45 * ease * scale;
    swingAngle = 5 - 17 * ease;
  } else {
    gap = 45 * scale;
    swingAngle = -12;
  }

  ctx.save();

  // Left hammer
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx - gap - headWidth, cy);
  ctx.rotate((swingAngle * Math.PI) / 180);
  drawHammer(ctx, scale, 'right');
  ctx.restore();

  // Right hammer
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx + gap + headWidth, cy);
  ctx.rotate((-swingAngle * Math.PI) / 180);
  drawHammer(ctx, scale, 'left');
  ctx.restore();

  // Impact flash (no shadowBlur — use gradient only)
  if (pair.flashAlpha > 0.01) {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pair.flashRadius);
    grad.addColorStop(0, `rgba(251, 191, 36, ${pair.flashAlpha})`);
    grad.addColorStop(0.3, `rgba(245, 158, 11, ${pair.flashAlpha * 0.7})`);
    grad.addColorStop(0.6, `rgba(139, 92, 246, ${pair.flashAlpha * 0.3})`);
    grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, pair.flashRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sparks (NO shadowBlur — just colored circles for performance)
  for (const spark of pair.sparks) {
    ctx.globalAlpha = Math.min(spark.life * 0.95, 1);
    ctx.fillStyle = spark.color;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, spark.size * Math.max(spark.life, 0.2), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/** Draws a single hammer at the current transform origin (no shadowBlur for performance). */
function drawHammer(ctx: CanvasRenderingContext2D, scale: number, headDir: 'left' | 'right'): void {
  const handleW = 60 * scale;
  const handleH = 8 * scale;
  const headW = 26 * scale;
  const headH = 36 * scale;
  const isRight = headDir === 'right';

  // Handle
  ctx.fillStyle = '#8B5CF6';
  ctx.beginPath();
  roundRect(ctx, isRight ? -handleW : 0, -handleH / 2, handleW, handleH, 3 * scale);
  ctx.fill();

  // Head
  ctx.fillStyle = '#7C3AED';
  ctx.beginPath();
  roundRect(ctx, isRight ? -2 * scale : -headW + 2 * scale, -headH / 2, headW, headH, 5 * scale);
  ctx.fill();

  // Shine highlight
  ctx.fillStyle = 'rgba(196, 181, 253, 0.3)';
  ctx.beginPath();
  roundRect(ctx, isRight ? headW - 7 * scale : -headW + 3 * scale, -headH / 2 + 4 * scale, 4 * scale, headH - 8 * scale, 2 * scale);
  ctx.fill();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
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
