import { Component, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
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
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
              </svg>
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
              13rian
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
  i18n = inject(I18nService);
  currentYear = new Date().getFullYear();
}
