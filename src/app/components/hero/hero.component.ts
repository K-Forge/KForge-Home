import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  template: `
    <section class="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      <!-- Background Gradient Effect -->
      <div class="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-bg to-pure-black opacity-90"></div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-lava-orange opacity-10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-lava-orange opacity-5 rounded-full blur-[150px]"></div>

      <!-- Content -->
      <div class="relative z-10 max-w-5xl mx-auto text-center">
        <!-- Logo/Title -->
        <div class="mb-8">
          <h1 class="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
            K-<span class="text-lava-orange">FORGE</span>
          </h1>
          <div class="h-1 w-24 bg-lava-orange mx-auto"></div>
        </div>

        <!-- Tagline -->
        <h2 class="text-2xl md:text-4xl font-light text-gray-300 mb-6 tracking-wide">
          Forjando el <span class="text-lava-orange font-medium">Código</span> del Futuro
        </h2>

        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Somos un club universitario de desarrollo de software donde estudiantes apasionados 
          transforman ideas en proyectos reales.
        </p>

        <!-- CTA Button -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="mailto:k-forge@university.edu"
            class="group relative px-8 py-4 bg-lava-orange text-white font-semibold rounded-lg 
                   hover:bg-lava-orange-hover transition-all duration-300 transform hover:scale-105 
                   hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] uppercase tracking-wider text-sm">
            Unirse al Club
            <span class="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
          </a>
          
          <a 
            href="#projects"
            class="px-8 py-4 border-2 border-gray-700 text-gray-300 font-semibold rounded-lg 
                   hover:border-lava-orange hover:text-lava-orange transition-all duration-300 
                   uppercase tracking-wider text-sm">
            Ver Proyectos
          </a>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div class="animate-bounce">
            <svg class="w-6 h-6 text-lava-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .animate-bounce {
      animation: bounce 2s infinite;
    }
  `]
})
export class HeroComponent {}
