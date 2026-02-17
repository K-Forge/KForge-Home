import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <section class="relative h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 overflow-hidden">
      <!-- Base Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-midnight via-surface to-midnight"></div>

      <!-- ═══ TRON CIRCUIT ANIMATION (desktop only, reduced traces) ═══ -->
      <div class="absolute inset-0 overflow-hidden hidden md:block" aria-hidden="true">
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="trace-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Static dim circuit grid -->
          <g class="opacity-[0.06]" stroke="rgba(139,92,246,1)" stroke-width="1" fill="none">
            <path d="M-50,120 H280 V220 H480 V120 H700 V300 H920 V120 H1250"/>
            <path d="M-50,350 H200 V260 H440 V450 H680 V350 H900 V500 H1250"/>
            <path d="M-50,560 H320 V470 H540 V630 H740 V560 H980 V680 H1250"/>
            <path d="M-50,720 H160 V630 H400 V760 H620 V720 H820 V780 H1250"/>
            <path d="M280,0 V120 H340 V350 H280 V560 H340 V800"/>
            <path d="M580,0 V220 H640 V350 H580 V470 H640 V800"/>
            <path d="M880,0 V120 H940 V300 H880 V500 H940 V800"/>
          </g>

          <!-- Animated light traces (reduced from 7 to 4) -->
          <g fill="none" stroke-width="1.5" filter="url(#trace-glow)">
            <path d="M-50,120 H280 V220 H480 V120 H700 V300 H920 V120 H1250" class="trace trace-1"/>
            <path d="M-50,350 H200 V260 H440 V450 H680 V350 H900 V500 H1250" class="trace trace-2"/>
            <path d="M-50,560 H320 V470 H540 V630 H740 V560 H980 V680 H1250" class="trace trace-3"/>
            <path d="M580,0 V220 H640 V350 H580 V470 H640 V800" class="trace trace-4"/>
          </g>

          <!-- Junction nodes (reduced from 10 to 5) -->
          <g>
            <circle cx="280" cy="120" r="2.5" class="node node-1"/>
            <circle cx="700" cy="300" r="2.5" class="node node-2"/>
            <circle cx="680" cy="350" r="2.5" class="node node-3"/>
            <circle cx="540" cy="630" r="2.5" class="node node-4"/>
            <circle cx="640" cy="470" r="2.5" class="node node-5"/>
          </g>
        </svg>
      </div>

      <!-- ═══ GLOW BLOBS (reduced from 3 to 2, smaller blur on mobile) ═══ -->
      <div class="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px]
                  bg-violet-primary/[0.07] rounded-full blur-[80px] md:blur-[180px] animate-pulse-glow"
           aria-hidden="true"></div>
      <div class="absolute bottom-1/3 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px]
                  bg-violet-deep/[0.06] rounded-full blur-[80px] md:blur-[150px] animate-pulse-glow"
           style="animation-delay: 1.5s;" aria-hidden="true"></div>

      <!-- Content -->
      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <!-- Logo -->
        <div class="mb-10">
          <h1 class="text-7xl md:text-9xl font-bold tracking-tighter mb-4">
            K-<span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-primary to-violet-glow">FORGE</span>
          </h1>
          <div class="h-1 w-20 bg-gradient-to-r from-violet-primary to-violet-glow mx-auto rounded-full"></div>
        </div>

        <!-- Tagline -->
        <h2 class="text-2xl md:text-4xl font-light text-text-muted mb-6 tracking-wide">
          {{ i18n.t('hero.tagline.pre') }} <span class="text-violet-primary font-medium">{{ i18n.t('hero.tagline.highlight') }}</span> {{ i18n.t('hero.tagline.post') }}
        </h2>

        <p class="text-base md:text-lg text-text-muted/70 max-w-2xl mx-auto mb-14 leading-relaxed">
          {{ i18n.t('hero.description') }}
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#contact"
             class="group relative px-8 py-4 bg-violet-primary text-white font-semibold rounded-xl
                    hover:bg-violet-deep transition-all duration-300
                    hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] uppercase tracking-wider text-sm">
            {{ i18n.t('hero.cta.join') }}
            <span class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
          </a>

          <a href="#projects"
             class="px-8 py-4 border border-surface-light text-text-muted font-semibold rounded-xl
                    hover:border-violet-primary/50 hover:text-violet-primary transition-all duration-300
                    uppercase tracking-wider text-sm">
            {{ i18n.t('hero.cta.projects') }}
          </a>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div class="flex flex-col items-center gap-2">
          <svg class="w-6 h-9 text-violet-primary/50" viewBox="0 0 24 36" fill="none"
               stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="1" width="18" height="28" rx="9" stroke-width="1.5"/>
            <circle cx="12" cy="10" r="1.5" fill="currentColor" class="scroll-dot"/>
          </svg>
          <span class="text-[10px] text-text-muted/30 uppercase tracking-widest">{{ i18n.t('hero.scroll') }}</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── Tron Circuit Traces (reduced to 4) ── */
    .trace {
      stroke: rgba(139, 92, 246, 0.25);
      stroke-dasharray: 80 600;
      stroke-linecap: round;
    }
    .trace-1 { animation: flow 7s linear infinite; }
    .trace-2 { animation: flow 9s linear infinite; animation-delay: -2s; }
    .trace-3 { animation: flow 11s linear infinite; animation-delay: -5s; }
    .trace-4 { animation: flow 10s linear infinite; animation-delay: -1s; }

    @keyframes flow {
      0%   { stroke-dashoffset: 680;  stroke: rgba(139,92,246, 0.08); }
      40%  { stroke: rgba(139,92,246, 0.5); }
      60%  { stroke: rgba(167,139,250, 0.4); }
      100% { stroke-dashoffset: -680; stroke: rgba(139,92,246, 0.08); }
    }

    /* ── Junction Nodes (reduced to 5) ── */
    .node { fill: rgba(139, 92, 246, 0.15); }
    .node-1 { animation: pulse-node 5s ease-in-out infinite; }
    .node-2 { animation: pulse-node 6s ease-in-out infinite; animation-delay: -2s; }
    .node-3 { animation: pulse-node 4.5s ease-in-out infinite; animation-delay: -0.5s; }
    .node-4 { animation: pulse-node 5.5s ease-in-out infinite; animation-delay: -4s; }
    .node-5 { animation: pulse-node 4s ease-in-out infinite; animation-delay: -1.5s; }

    @keyframes pulse-node {
      0%, 100% { fill: rgba(139,92,246, 0.1);  r: 2.5; }
      50%      { fill: rgba(139,92,246, 0.55); r: 4.5; }
    }

    /* ── Mouse Scroll Indicator ── */
    .scroll-dot {
      animation: scroll-wheel 2s ease-in-out infinite;
    }

    @keyframes scroll-wheel {
      0%   { cy: 9;  opacity: 1; }
      40%  { cy: 16; opacity: 0.2; }
      80%  { cy: 9;  opacity: 0; }
      100% { cy: 9;  opacity: 1; }
    }
  `]
})
export class HeroComponent {
  readonly i18n = inject(I18nService);
}
