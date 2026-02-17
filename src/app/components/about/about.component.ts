import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FadeInDirective, SectionHeaderComponent],
  template: `
    <section id="about" class="about-people-bg relative px-6 py-10 md:py-14 bg-surface flex items-center overflow-hidden">
      <div class="max-w-5xl mx-auto w-full">

        <!-- Section Header -->
        <app-section-header
          [title]="i18n.t('about.title')"
          [subtitle]="i18n.t('about.subtitle')" />

        <!-- Forge Path: vertical timeline -->
        <div class="forge-path relative">

          <!-- Glowing vertical line -->
          <div class="timeline-line absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px" aria-hidden="true"></div>

          <!-- ═══ 1. El Porqué ═══ -->
          <div class="forge-step mb-6 md:mb-8 relative flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4"
               appFadeIn="up" [fadeDelay]="0">

            <!-- Node -->
            <div class="forge-node absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
              <span class="node-ring"></span>
              <span class="node-number">01</span>
            </div>

            <!-- Content: left side on desktop -->
            <div class="md:w-1/2 md:pr-16 md:text-right pl-16 md:pl-0">
              <span class="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-violet-primary mb-1.5 opacity-80">
                {{ i18n.t('about.why.tag') }}
              </span>
              <h3 class="text-2xl md:text-3xl font-bold text-text-primary mb-1 leading-tight">
                {{ i18n.t('about.why.title') }}
              </h3>
              <p class="text-violet-glow/80 italic text-sm mb-2">
                {{ i18n.t('about.why.tagline') }}
              </p>
              <p class="text-text-muted text-[15px] leading-snug">
                {{ i18n.t('about.why.desc') }}
              </p>
            </div>

            <!-- Spacer for right side -->
            <div class="hidden md:block md:w-1/2"></div>
          </div>

          <!-- ═══ 2. El Qué ═══ -->
          <div class="forge-step mb-6 md:mb-8 relative flex flex-col md:flex-row-reverse items-start md:items-center gap-3 md:gap-4"
               appFadeIn="up" [fadeDelay]="200">

            <!-- Node -->
            <div class="forge-node absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
              <span class="node-ring"></span>
              <span class="node-number">02</span>
            </div>

            <!-- Content: right side on desktop -->
            <div class="md:w-1/2 md:pl-16 md:text-left pl-16 md:pl-16">
              <span class="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-violet-primary mb-1.5 opacity-80">
                {{ i18n.t('about.what.tag') }}
              </span>
              <h3 class="text-2xl md:text-3xl font-bold text-text-primary mb-1 leading-tight">
                {{ i18n.t('about.what.title') }}
              </h3>
              <p class="text-violet-glow/80 italic text-sm mb-2">
                {{ i18n.t('about.what.tagline') }}
              </p>
              <p class="text-text-muted text-[15px] leading-snug">
                {{ i18n.t('about.what.desc') }}
              </p>
            </div>

            <!-- Spacer for left side -->
            <div class="hidden md:block md:w-1/2"></div>
          </div>

          <!-- ═══ 3. El Cómo ═══ -->
          <div class="forge-step relative flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4"
               appFadeIn="up" [fadeDelay]="400">

            <!-- Node -->
            <div class="forge-node absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
              <span class="node-ring"></span>
              <span class="node-number">03</span>
            </div>

            <!-- Content: left side on desktop -->
            <div class="md:w-1/2 md:pr-16 md:text-right pl-16 md:pl-0">
              <span class="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-violet-primary mb-1.5 opacity-80">
                {{ i18n.t('about.how.tag') }}
              </span>
              <h3 class="text-2xl md:text-3xl font-bold text-text-primary mb-1 leading-tight">
                {{ i18n.t('about.how.title') }}
              </h3>
              <p class="text-violet-glow/80 italic text-sm mb-2">
                {{ i18n.t('about.how.tagline') }}
              </p>
              <p class="text-text-muted text-[15px] leading-snug">
                {{ i18n.t('about.how.desc') }}
              </p>
            </div>

            <!-- Spacer for right side -->
            <div class="hidden md:block md:w-1/2"></div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── Background image ── */
    .about-people-bg {
      isolation: isolate;
    }
    .about-people-bg::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url('/assets/images/forge.png');
      background-repeat: no-repeat;
      background-size: 340px auto;
      background-position: right 2% top 8%;
      filter: brightness(0) saturate(100%) invert(53%) sepia(73%) saturate(1405%) hue-rotate(227deg) brightness(108%) contrast(98%);
      opacity: 0.2;
      pointer-events: none;
      z-index: 0;
    }
    @media (max-width: 1024px) {
      .about-people-bg::before {
        background-size: 280px auto;
        background-position: right -20px top 6%;
      }
    }
    @media (max-width: 768px) {
      .about-people-bg::before {
        background-size: 210px auto;
        background-position: right -36px top 4%;
        opacity: 0.16;
      }
    }
    .about-people-bg > div {
      position: relative;
      z-index: 1;
    }

    /* ── Timeline line ── */
    .timeline-line {
      background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(139, 92, 246, 0.35) 10%,
        rgba(139, 92, 246, 0.35) 90%,
        transparent 100%
      );
    }

    /* ── Node (circle + number) ── */
    .forge-node {
      width: 48px;
      height: 48px;
    }
    .node-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid rgba(139, 92, 246, 0.5);
      background: #12121A;
      transition: border-color 0.4s, box-shadow 0.4s;
    }
    .forge-step:hover .node-ring {
      border-color: #8B5CF6;
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.35);
    }
    .node-number {
      position: relative;
      z-index: 1;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #8B5CF6;
      font-family: 'Inter', monospace;
    }

    /* ── Step hover glow ── */
    .forge-step {
      transition: transform 0.4s ease;
    }
    .forge-step:hover {
      transform: translateY(-2px);
    }
  `]
})
export class AboutComponent {
  readonly i18n = inject(I18nService);
}
