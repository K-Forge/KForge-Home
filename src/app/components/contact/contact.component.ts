import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { I18nService } from '../../services/i18n.service';

type FormState = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, FadeInDirective, SectionHeaderComponent],
  template: `
    <section class="relative px-6 py-20 md:py-24 bg-midnight min-h-screen flex items-center">
      <div class="max-w-2xl mx-auto w-full">
        <!-- Section Header -->
        <app-section-header
          [title]="i18n.t('contact.title')"
          [subtitle]="i18n.t('contact.subtitle')" />

        <!-- Form Container -->
        <div class="relative p-8 md:p-10 rounded-2xl bg-surface border border-surface-light"
             appFadeIn="up" [fadeDelay]="150">

          <!-- Success Overlay -->
          @if (formState() === 'success') {
            <div class="absolute inset-0 rounded-2xl bg-surface/95 backdrop-blur-sm 
                        flex flex-col items-center justify-center z-10 animate-fade-in">
              <div class="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <p class="text-text-primary font-semibold text-lg">{{ i18n.t('contact.success.title') }}</p>
              <p class="text-text-muted text-sm mt-2">{{ i18n.t('contact.success.subtitle') }}</p>
              <button (click)="resetForm()" 
                      class="mt-6 px-4 py-2 text-sm text-violet-primary border border-violet-primary/30 
                             rounded-lg hover:bg-violet-primary/10 transition-colors">
                {{ i18n.t('contact.success.another') }}
              </button>
            </div>
          }

          <!-- Error Overlay -->
          @if (formState() === 'error') {
            <div class="absolute inset-0 rounded-2xl bg-surface/95 backdrop-blur-sm 
                        flex flex-col items-center justify-center z-10 animate-fade-in">
              <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p class="text-text-primary font-semibold text-lg">{{ i18n.t('contact.error.title') }}</p>
              <p class="text-text-muted text-sm mt-2">{{ i18n.t('contact.error.subtitle') }}</p>
              <button (click)="formState.set('idle')" 
                      class="mt-6 px-4 py-2 text-sm text-violet-primary border border-violet-primary/30 
                             rounded-lg hover:bg-violet-primary/10 transition-colors">
                {{ i18n.t('contact.error.retry') }}
              </button>
            </div>
          }

          <form (submit)="onSubmit($event)" class="flex flex-col gap-6">
            <!-- Name -->
            <div class="flex flex-col gap-2">
              <label for="name" class="text-sm font-medium text-text-muted">{{ i18n.t('contact.name') }}</label>
              <input type="text" id="name" name="name" required
                     [(ngModel)]="name"
                     [placeholder]="i18n.t('contact.name.placeholder')"
                     class="w-full px-4 py-3 bg-midnight border border-surface-light rounded-xl 
                            text-text-primary placeholder-text-muted/50 text-sm
                            focus:outline-none focus:border-violet-primary focus:ring-1 focus:ring-violet-primary/30 
                            transition-all duration-300" />
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm font-medium text-text-muted">{{ i18n.t('contact.email') }}</label>
              <input type="email" id="email" name="email" required
                     [(ngModel)]="email"
                     [placeholder]="i18n.t('contact.email.placeholder')"
                     class="w-full px-4 py-3 bg-midnight border border-surface-light rounded-xl 
                            text-text-primary placeholder-text-muted/50 text-sm
                            focus:outline-none focus:border-violet-primary focus:ring-1 focus:ring-violet-primary/30 
                            transition-all duration-300" />
            </div>

            <!-- Message -->
            <div class="flex flex-col gap-2">
              <label for="message" class="text-sm font-medium text-text-muted">{{ i18n.t('contact.message') }}</label>
              <textarea id="message" name="message" rows="5" required
                        [(ngModel)]="message"
                        maxlength="500"
                        [placeholder]="i18n.t('contact.message.placeholder')"
                        class="w-full px-4 py-3 bg-midnight border border-surface-light rounded-xl 
                               text-text-primary placeholder-text-muted/50 text-sm resize-none
                               focus:outline-none focus:border-violet-primary focus:ring-1 focus:ring-violet-primary/30 
                               transition-all duration-300"></textarea>
              <div class="text-right text-xs text-text-muted/50">
                {{ message.length }}/500
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" 
                    [disabled]="formState() === 'sending'"
                    class="w-full py-3.5 bg-violet-primary text-white font-semibold rounded-xl 
                           hover:bg-violet-deep transition-all duration-300 
                           hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 text-sm">
              @if (formState() === 'sending') {
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {{ i18n.t('contact.sending') }}
              } @else {
                {{ i18n.t('contact.submit') }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              }
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class ContactComponent {
  readonly i18n = inject(I18nService);

  // You can change this to K-FORGE's actual email
  private readonly DESTINATION_EMAIL = 'kforge.dev@gmail.com';

  formState = signal<FormState>('idle');

  name = '';
  email = '';
  message = '';

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.name.trim() || !this.email.trim() || !this.message.trim()) return;

    this.formState.set('sending');

    const formData = new FormData();
    formData.append('name', this.name.trim());
    formData.append('email', this.email.trim());
    formData.append('message', this.message.trim());
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('_subject', `K-FORGE: Nuevo mensaje de ${this.name.trim()}`);
    formData.append('_autoresponse',
      `¡Hola ${this.name.trim()}! Hemos recibido tu mensaje en K-FORGE. Te responderemos pronto. 🔥`
    );

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${this.DESTINATION_EMAIL}`,
        {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' },
        }
      );

      if (response.ok) {
        this.formState.set('success');
      } else {
        throw new Error('Send failed');
      }
    } catch {
      this.formState.set('error');
    }
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.message = '';
    this.formState.set('idle');
  }
}
