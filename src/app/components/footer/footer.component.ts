import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { I18nService } from '../../services/i18n.service';
import { GithubIconComponent } from '../../shared/github-icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GithubIconComponent],
  template: `
    <footer class="bg-surface border-t border-surface-light">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <!-- Top row: brand + contact + to top -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
          <!-- Brand -->
          <div class="flex items-center gap-3">
            <span class="text-xl font-bold text-text-primary">
              K-<span class="text-violet-primary">FORGE</span>
            </span>
            <span class="text-text-muted/30 hidden sm:inline">|</span>
            <span class="text-xs text-text-muted/50 hidden sm:inline">{{ i18n.t('footer.tagline') }}</span>
          </div>

          <!-- Contact -->
          <div class="flex items-center gap-4">
            <a href="mailto:kforge.dev&#64;gmail.com"
               class="inline-flex items-center gap-2 text-sm text-text-muted hover:text-violet-primary transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              kforge.dev&#64;gmail.com
            </a>
            <a href="https://github.com/K-Forge" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 text-sm text-text-muted hover:text-violet-primary transition-colors">
              <github-icon [size]="16" />
              GitHub
            </a>
          </div>

          <!-- To Top -->
          <a href="#home"
             class="px-4 py-2 text-xs font-medium text-text-muted border border-surface-light rounded-lg
                    hover:border-violet-primary/40 hover:text-violet-primary transition-all duration-300">
            ↑ {{ i18n.t('footer.toTop') }}
          </a>
        </div>

        <!-- Bottom line -->
        <div class="mt-6 pt-4 border-t border-surface-light/30 text-center">
          <p class="text-xs text-text-muted/40">
            &copy; {{ currentYear }} K-FORGE · {{ i18n.t('footer.madeBy') }}
            <a href="https://github.com/13rianVargas" target="_blank" rel="noopener"
               class="text-text-muted/60 hover:text-violet-primary transition-colors">
              13rian Vargas
            </a>
            💛
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  readonly i18n = inject(I18nService);
  readonly currentYear = new Date().getFullYear();
}
