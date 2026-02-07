import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroComponent, ProjectsComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-dark-bg">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 bg-pure-black/80 backdrop-blur-md border-b border-gray-900">
        <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" class="text-2xl font-bold">
            K-<span class="text-lava-orange">FORGE</span>
          </a>
          
          <div class="hidden md:flex items-center gap-8">
            <a href="#home" class="text-gray-300 hover:text-lava-orange transition-colors text-sm font-medium">
              Inicio
            </a>
            <a href="#projects" class="text-gray-300 hover:text-lava-orange transition-colors text-sm font-medium">
              Proyectos
            </a>
            <a href="mailto:k-forge@university.edu" 
               class="px-4 py-2 bg-lava-orange text-white text-sm font-semibold rounded-lg 
                      hover:bg-lava-orange-hover transition-all duration-300">
              Contacto
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button class="md:hidden text-gray-300 hover:text-lava-orange">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </nav>
      </header>

      <!-- Main Content -->
      <main id="home" class="pt-16">
        <app-hero />
        <app-projects />
      </main>

      <!-- Footer -->
      <app-footer />
    </div>
  `,
  styles: []
})
export class App {}
