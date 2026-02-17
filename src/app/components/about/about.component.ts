import { Component, inject } from '@angular/core';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="about" class="about-people-bg relative px-6 py-20 md:py-24 bg-surface min-h-screen flex items-center">
      <div class="max-w-6xl mx-auto w-full">
        <!-- Section Header -->
        <div class="text-center mb-14" appFadeIn="up">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-text-primary">
            <span class="text-violet-primary">{{ i18n.t('about.title') }}</span>
          </h2>
          <div class="h-1 w-16 bg-violet-primary mx-auto mb-6 rounded-full"></div>
          <p class="text-lg text-text-muted max-w-xl mx-auto">
            {{ i18n.t('about.subtitle') }}
          </p>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Mission -->
          <div class="group p-8 rounded-2xl bg-midnight border border-surface-light 
                      hover:border-violet-primary/40 transition-all duration-500"
               appFadeIn="up" [fadeDelay]="0">
            <div class="w-14 h-14 rounded-xl bg-violet-primary/10 flex items-center justify-center mb-6 
                        group-hover:bg-violet-primary/20 transition-colors">
              <svg class="w-7 h-7 text-violet-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-text-primary mb-3">{{ i18n.t('about.mission.title') }}</h3>
            <p class="text-text-muted text-sm leading-relaxed">
              {{ i18n.t('about.mission.desc') }}
            </p>
          </div>

          <!-- What We Do -->
          <div class="group p-8 rounded-2xl bg-midnight border border-surface-light 
                      hover:border-violet-primary/40 transition-all duration-500"
               appFadeIn="up" [fadeDelay]="150">
            <div class="w-14 h-14 rounded-xl bg-violet-primary/10 flex items-center justify-center mb-6 
                        group-hover:bg-violet-primary/20 transition-colors">
              <svg class="w-7 h-7 text-violet-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-text-primary mb-3">{{ i18n.t('about.what.title') }}</h3>
            <p class="text-text-muted text-sm leading-relaxed">
              {{ i18n.t('about.what.desc') }}
            </p>
          </div>

          <!-- Why Join -->
          <div class="group p-8 rounded-2xl bg-midnight border border-surface-light 
                      hover:border-violet-primary/40 transition-all duration-500"
               appFadeIn="up" [fadeDelay]="300">
            <div class="w-14 h-14 rounded-xl bg-violet-primary/10 flex items-center justify-center mb-6 
                        group-hover:bg-violet-primary/20 transition-colors">
              <svg class="w-7 h-7 text-violet-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-text-primary mb-3">{{ i18n.t('about.why.title') }}</h3>
            <p class="text-text-muted text-sm leading-relaxed">
              {{ i18n.t('about.why.desc') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
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
      background-position: left 2% top 8%;
      filter: brightness(0) saturate(100%) invert(53%) sepia(73%) saturate(1405%) hue-rotate(227deg) brightness(108%) contrast(98%);
      opacity: 0.2;
      pointer-events: none;
      z-index: 0;
    }

    @media (max-width: 1024px) {
      .about-people-bg::before {
        background-size: 280px auto;
        background-position: left -20px top 6%;
      }
    }

    @media (max-width: 768px) {
      .about-people-bg::before {
        background-size: 210px auto;
        background-position: left -36px top 4%;
        opacity: 0.16;
      }
    }

    .about-people-bg > div {
      position: relative;
      z-index: 1;
    }
  `]
})
export class AboutComponent {
  i18n = inject(I18nService);
}
