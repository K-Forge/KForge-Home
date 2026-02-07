# K-FORGE Landing Page 🔥

Landing page moderna y minimalista para K-FORGE, club universitario de desarrollo de software.

## 🚀 Stack Tecnológico

- **Framework**: Angular 17+ (Standalone Components)
- **Estilos**: Tailwind CSS 3
- **Package Manager**: Bun
- **Deploy**: Vercel

## 🎨 Características

- ✅ Diseño Dark Mode minimalista
- ✅ Componentes standalone de Angular
- ✅ Integración dinámica con GitHub API
- ✅ Responsive design
- ✅ Animaciones suaves
- ✅ Paleta de colores personalizada (Naranja Lava)

## 📦 Instalación

```bash
# Instalar dependencias
bun install

# Desarrollo
bun run ng serve

# Build
bun run build
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── hero/          # Sección Hero
│   │   ├── projects/      # Galería de proyectos
│   │   └── footer/        # Footer
│   ├── services/
│   │   └── github.service.ts  # Servicio API GitHub
│   ├── models/
│   │   └── github-repo.interface.ts
│   ├── app.ts            # Componente principal
│   └── app.config.ts     # Configuración de la app
├── styles.css            # Estilos globales + Tailwind
└── index.html
```

## 🎯 Proyectos Destacados

La aplicación consume la API de GitHub para mostrar dinámicamente los repositorios de la organización K-Forge, priorizando:

- K-APP
- Gretta
- Tienda-K
- KomidaGPT

## 🚀 Deploy en Vercel

### Opción 1: CLI de Vercel

```bash
# Instalar Vercel CLI
bun add -g vercel

# Deploy
vercel
```

### Opción 2: GitHub Integration

1. Sube el proyecto a GitHub
2. Visita [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Vercel detectará automáticamente que es un proyecto Angular
5. Configuración sugerida:
   - **Framework Preset**: Angular
   - **Build Command**: `bun run build`
   - **Output Directory**: `dist/k-forge-web`
   - **Install Command**: `bun install`

### Configuración de Vercel (vercel.json)

Si necesitas crear el archivo `vercel.json`:

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist/k-forge-web",
  "installCommand": "bun install",
  "framework": "angular"
}
```

## 🎨 Paleta de Colores

- **Dark BG**: `#121212`
- **Pure Black**: `#000000`
- **Lava Orange**: `#FF4500`
- **Lava Orange Hover**: `#FF6A33`

## 📝 Personalización

### Cambiar el email de contacto

Edita los enlaces `mailto:` en:
- `src/app/components/hero/hero.component.ts`
- `src/app/components/footer/footer.component.ts`

### Modificar proyectos prioritarios

Edita el array en `src/app/services/github.service.ts`:

```typescript
private readonly PRIORITY_REPOS = ['K-APP', 'Gretta', 'Tienda-K', 'KomidaGPT'];
```

### Cambiar organización de GitHub

Modifica la URL en `src/app/services/github.service.ts`:

```typescript
private readonly GITHUB_API = 'https://api.github.com/users/TU-ORG/repos';
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
bun run ng serve

# Build de producción
bun run build

# Tests
bun run test

# Linting
bun run lint
```

## 📄 Licencia

© 2026 K-FORGE. Todos los derechos reservados.

---

Hecho con ❤️ por estudiantes apasionados

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
