import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FadeInDirective } from '../directives/fade-in.directive';

/**
 * Reusable section header with title, underline, and subtitle.
 * Replaces the identical pattern in about, projects, team, and contact.
 */
@Component({
    selector: 'app-section-header',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FadeInDirective],
    template: `
    <div class="text-center mb-14" appFadeIn="up">
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-text-primary">
        <span class="text-violet-primary">{{ title }}</span>
      </h2>
      <div class="h-1 w-16 bg-violet-primary mx-auto mb-6 rounded-full"></div>
      @if (subtitle) {
        <p class="text-lg text-text-muted max-w-xl mx-auto">{{ subtitle }}</p>
      }
    </div>
  `,
})
export class SectionHeaderComponent {
    @Input({ required: true }) title!: string;
    @Input() subtitle?: string;
}
