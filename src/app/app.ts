import { Component, signal, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TeamComponent } from './components/team/team.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { I18nService } from './services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroComponent, AboutComponent, ProjectsComponent, TeamComponent, ContactComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-midnight">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
              [class.bg-midnight/90]="scrolled()"
              [class.backdrop-blur-md]="scrolled()"
              [class.border-b]="scrolled()"
              [class.border-surface-light]="scrolled()">
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
            <!-- Language Toggle -->
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

            <!-- Mobile Menu Button -->
            <button class="md:hidden text-text-muted hover:text-violet-primary transition-colors"
                    (click)="menuOpen.set(!menuOpen())"
                    [attr.aria-label]="menuOpen() ? 'Cerrar menú' : 'Abrir menú'">
              @if (menuOpen()) {
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
        @if (menuOpen()) {
          <div class="md:hidden bg-midnight/95 backdrop-blur-lg border-t border-surface-light animate-fade-in">
            <div class="flex flex-col items-center gap-4 py-6">
              @for (link of navLinks; track link.id) {
                <a [href]="'#' + link.id" (click)="menuOpen.set(false)"
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

      <!-- Main Content -->
      <main id="home" class="pt-16">
        <app-hero />
        <app-about />
        <app-projects />
        <app-team />
        <app-contact />
      </main>

      <app-footer />
    </div>
  `,
  styles: []
})
export class App implements OnInit, OnDestroy {
  i18n = inject(I18nService);

  menuOpen = signal(false);
  scrolled = signal(false);
  activeSection = signal('home');

  readonly navLinks = [
    { id: 'home', key: 'nav.home' },
    { id: 'about', key: 'nav.about' },
    { id: 'projects', key: 'nav.projects' },
    { id: 'team', key: 'nav.team' },
    { id: 'contact', key: 'nav.contact' },
  ];

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.setupSectionObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 50);

    if (window.scrollY <= 10 && this.activeSection() !== 'home') {
      this.activeSection.set('home');
    }
  }

  private setupSectionObserver(): void {
    const ids = ['home', 'about', 'projects', 'team', 'contact'];

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    // Delayed to let Angular render sections
    setTimeout(() => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) this.observer!.observe(el);
      }
    }, 100);
  }
}
