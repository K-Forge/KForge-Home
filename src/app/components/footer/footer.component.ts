import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="bg-pure-black border-t border-gray-900 px-6 py-12">
      <div class="max-w-7xl mx-auto">
        <!-- Main Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <!-- Brand -->
          <div>
            <h3 class="text-2xl font-bold mb-2">
              K-<span class="text-lava-orange">FORGE</span>
            </h3>
            <p class="text-gray-500 text-sm">
              Club universitario de desarrollo de software
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Enlaces</h4>
            <ul class="space-y-2">
              <li>
                <a href="#home" class="text-gray-400 hover:text-lava-orange transition-colors text-sm">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#projects" class="text-gray-400 hover:text-lava-orange transition-colors text-sm">
                  Proyectos
                </a>
              </li>
              <li>
                <a href="mailto:k-forge@university.edu" class="text-gray-400 hover:text-lava-orange transition-colors text-sm">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <!-- Social Links -->
          <div>
            <h4 class="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Comunidad</h4>
            <div class="flex gap-4">
              <!-- GitHub -->
              <a href="https://github.com/K-Forge" 
                 target="_blank"
                 class="w-10 h-10 bg-dark-bg border border-gray-800 rounded-lg flex items-center justify-center 
                        hover:border-lava-orange hover:bg-gray-900 transition-all duration-300 group">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-lava-orange transition-colors" 
                     fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
                </svg>
              </a>

              <!-- Email -->
              <a href="mailto:k-forge@university.edu" 
                 class="w-10 h-10 bg-dark-bg border border-gray-800 rounded-lg flex items-center justify-center 
                        hover:border-lava-orange hover:bg-gray-900 transition-all duration-300 group">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-lava-orange transition-colors" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>

              <!-- Discord (opcional) -->
              <a href="#" 
                 class="w-10 h-10 bg-dark-bg border border-gray-800 rounded-lg flex items-center justify-center 
                        hover:border-lava-orange hover:bg-gray-900 transition-all duration-300 group">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-lava-orange transition-colors" 
                     fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-900 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <!-- Copyright -->
            <p class="text-gray-500 text-sm">
              © {{ currentYear }} K-FORGE. Todos los derechos reservados.
            </p>

            <!-- Made with love -->
            <p class="text-gray-600 text-sm flex items-center gap-2">
              Hecho con 
              <span class="text-lava-orange">❤️</span> 
              por estudiantes apasionados
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
