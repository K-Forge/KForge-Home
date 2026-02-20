import {
  Component, signal, inject, NgZone,
  OnInit, OnDestroy, afterNextRender, ChangeDetectionStrategy,
} from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TeamComponent } from './components/team/team.component';
import { ContactComponent } from './components/contact/contact.component';
import { I18nService } from './services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent, AboutComponent, FooterComponent,
    ProjectsComponent, TeamComponent, ContactComponent,
  ],
  template: `
    <div class="min-h-screen bg-midnight">

      <!-- ═══ HEADER ═══ -->
      <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
              [class.bg-midnight/95]="isScrolled()"
              [class.md:backdrop-blur-md]="isScrolled()"
              [class.border-b]="isScrolled()"
              [class.border-surface-light]="isScrolled()">
        <nav class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" class="text-xl font-bold text-text-primary">
            K-<span class="text-violet-primary">FORGE</span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-1">
            @for (link of navLinks; track link.id) {
              <a [href]="'#' + link.id"
                 class="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                 [class.text-violet-primary]="activeSection() === link.id"
                 [class.text-text-muted]="activeSection() !== link.id"
                 [class.hover:text-violet-primary]="activeSection() !== link.id">
                {{ i18n.t(link.key) }}
                @if (activeSection() === link.id) {
                  <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-violet-primary rounded-full"></span>
                }
              </a>
            }
          </div>

          <!-- Language Toggle + Mobile Button -->
          <div class="flex items-center gap-3">
            <button (click)="i18n.toggleLang()"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                           border border-surface-light text-text-muted
                           hover:border-violet-primary/40 hover:text-violet-primary transition-all duration-300"
                    [attr.aria-label]="i18n.lang() === 'es' ? 'Switch to English' : 'Cambiar a Español'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.6 3.4 5.6 3.4 9s-1.2 6.4-3.4 9c-2.2-2.6-3.4-5.6-3.4-9s1.2-6.4 3.4-9z"/>
              </svg>
              {{ i18n.lang() === 'es' ? 'EN' : 'ES' }}
            </button>

            <button class="md:hidden text-text-muted hover:text-violet-primary transition-colors"
                    (click)="isMenuOpen.set(!isMenuOpen())"
                    [attr.aria-label]="isMenuOpen() ? 'Cerrar menú' : 'Abrir menú'">
              @if (isMenuOpen()) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              }
            </button>
          </div>
        </nav>

        <!-- Mobile Menu -->
        @if (isMenuOpen()) {
          <div class="md:hidden bg-midnight/95 border-t border-surface-light animate-fade-in">
            <div class="flex flex-col items-center gap-4 py-6">
              @for (link of navLinks; track link.id) {
                <a [href]="'#' + link.id" (click)="isMenuOpen.set(false)"
                   class="relative text-lg font-medium transition-colors px-4 py-1"
                   [class.text-violet-primary]="activeSection() === link.id"
                   [class.text-text-muted]="activeSection() !== link.id">
                  {{ i18n.t(link.key) }}
                  @if (activeSection() === link.id) {
                    <span class="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-violet-primary rounded-full"></span>
                  }
                </a>
              }
            </div>
          </div>
        }
      </header>

      <!-- ═══ MAIN CONTENT ═══ -->
      <main id="home" class="pt-16">
        <app-hero />
        <app-about />

        <!-- Defer heavy components until near viewport -->
        <!-- Wrapper divs carry the IDs so the IntersectionObserver always
             has a live DOM target, regardless of @defer load state. -->
        <div id="projects">
          @defer (on viewport) {
            <app-projects />
          } @placeholder {
            <section class="min-h-screen bg-midnight"></section>
          }
        </div>

        <div id="team">
          @defer (on viewport) {
            <app-team />
          } @placeholder {
            <section class="min-h-screen bg-surface"></section>
          }
        </div>

        <div id="contact">
          @defer (on viewport) {
            <app-contact />
          } @placeholder {
            <section class="min-h-screen bg-midnight"></section>
          }
        </div>
      </main>

      <app-footer />
    </div>
  `,
  styles: []
})
export class App implements OnInit, OnDestroy {
  readonly i18n = inject(I18nService);
  private readonly ngZone = inject(NgZone);

  /** UI state */
  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);
  readonly activeSection = signal('home');

  /** Navigation links config */
  readonly navLinks = [
    { id: 'home', key: 'nav.home' },
    { id: 'about', key: 'nav.about' },
    { id: 'projects', key: 'nav.projects' },
    { id: 'team', key: 'nav.team' },
    { id: 'contact', key: 'nav.contact' },
  ] as const;

  private sectionObserver?: IntersectionObserver;
  private scrollCleanup?: () => void;

  constructor() {
    // Wait for DOM to be ready before observing sections
    afterNextRender(() => this.setupSectionObserver());
  }

  ngOnInit(): void {
    this.setupThrottledScroll();
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
    this.scrollCleanup?.();
  }

  /**
   * Throttled scroll handler that runs outside Angular zone
   * to avoid triggering change detection on every scroll frame.
   * Uses rAF gating so it fires at most once per animation frame.
   */
  private setupThrottledScroll(): void {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        this.isScrolled.set(scrollY > 50);

        if (scrollY <= 10 && this.activeSection() !== 'home') {
          this.activeSection.set('home');
        }
        ticking = false;
      });
    };

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', onScroll, { passive: true });
    });

    this.scrollCleanup = () => window.removeEventListener('scroll', onScroll);
  }

  /** Observes each section to highlight the active nav link */
  private setupSectionObserver(): void {
    const sectionIds = ['home', 'about', 'projects', 'team', 'contact'];

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) this.sectionObserver.observe(el);
    }
  }
}
