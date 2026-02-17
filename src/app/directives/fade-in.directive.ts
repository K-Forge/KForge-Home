import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
    selector: '[appFadeIn]',
    standalone: true
})
export class FadeInDirective implements OnInit, OnDestroy {
    @Input() appFadeIn: 'up' | 'left' | 'right' = 'up';
    @Input() fadeDelay = 0;

    private observer?: IntersectionObserver;

    constructor(private el: ElementRef<HTMLElement>) { }

    ngOnInit(): void {
        const element = this.el.nativeElement;

        // Set initial hidden state
        element.style.opacity = '0';
        element.style.transition = `opacity 0.6s ease-out ${this.fadeDelay}ms, transform 0.6s ease-out ${this.fadeDelay}ms`;

        switch (this.appFadeIn) {
            case 'left':
                element.style.transform = 'translateX(-30px)';
                break;
            case 'right':
                element.style.transform = 'translateX(30px)';
                break;
            default:
                element.style.transform = 'translateY(24px)';
        }

        this.observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    element.style.opacity = '1';
                    element.style.transform = 'translate(0, 0)';
                    this.observer?.unobserve(element);
                }
            },
            { threshold: 0.15 }
        );

        this.observer.observe(element);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }
}
