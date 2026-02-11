# 🔧 ESPECIFICACIONES TÉCNICAS - K-FORGE LANDING PAGE

## 📊 Información del Proyecto

**Nombre**: K-FORGE Landing Page  
**Versión**: 1.0.0  
**Framework**: Angular 21.1.3  
**Node Runtime**: Bun 1.3.8  
**Estado**: ✅ En desarrollo (servidor corriendo en http://localhost:4200)

---

## 🏗️ Arquitectura del Proyecto

### Pattern: Component-Based Architecture
- **Tipo**: Standalone Components (Angular 17+)
- **Estado**: Angular Signals
- **HTTP**: HttpClient con Fetch API
- **Estilos**: Utility-First CSS (Tailwind)

### Estructura de Componentes

```
App (Root)
├── Header (inline template)
├── Hero Component (standalone)
├── Projects Component (standalone)
│   └── GithubService (injectable)
└── Footer Component (standalone)
```

---

## 📦 Dependencias del Proyecto

### Producción
```json
{
  "@angular/animations": "^21.1.0",
  "@angular/common": "^21.1.0",
  "@angular/compiler": "^21.1.0",
  "@angular/core": "^21.1.0",
  "@angular/platform-browser": "^21.1.0",
  "@angular/platform-browser-dynamic": "^21.1.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~0.15.0"
}
```

### Desarrollo
```json
{
  "@angular/cli": "~21.1.0",
  "@angular/compiler-cli": "^21.1.0",
  "@tailwindcss/postcss": "^4.1.18",
  "autoprefixer": "^10.4.24",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.19",
  "typescript": "~5.7.2"
}
```

---

## 🎨 Sistema de Diseño

### Tokens de Color (Tailwind)

```javascript
// tailwind.config.js
{
  colors: {
    'dark-bg': '#121212',      // Fondo principal
    'pure-black': '#000000',   // Secciones alternas
    'lava-orange': '#FF4500',  // Color primario
    'lava-orange-hover': '#FF6A33'  // Hover states
  }
}
```

### Tipografía

```css
font-family: 'Inter', 'Roboto', sans-serif;

/* Pesos disponibles */
300 - Light
400 - Regular
500 - Medium
600 - Semi Bold
700 - Bold
800 - Extra Bold
900 - Black
```

### Breakpoints (Tailwind Defaults)

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🔌 API Integration

### GitHub REST API

**Endpoint**: `GET https://api.github.com/users/K-Forge/repos`

**Headers**:
```
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

**Rate Limits**:
- Sin autenticación: 60 requests/hora por IP
- Con autenticación: 5,000 requests/hora

**Respuesta (GithubRepo)**:
```typescript
interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
}
```

**Filtrado Implementado**:
1. Prioriza repos: ['K-APP', 'Gretta', 'Tienda-K', 'KomidaGPT']
2. Ordena otros por fecha de actualización
3. Limita a 8 repos totales

---

## 📝 Componentes Detallados

### 1. HeroComponent

**Ubicación**: `src/app/components/hero/hero.component.ts`  
**Tipo**: Standalone, sin dependencias  
**Template**: Inline

**Features**:
- Gradiente de fondo animado
- 2 efectos blur para atmósfera
- 2 CTAs (primary + secondary)
- Scroll indicator animado
- 100% responsive

**CSS Custom**:
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

---

### 2. ProjectsComponent

**Ubicación**: `src/app/components/projects/projects.component.ts`  
**Tipo**: Standalone  
**Dependencias**: 
- `CommonModule` (ngFor, ngIf)
- `GithubService` (inyectado)

**Signals**:
```typescript
repos = signal<GithubRepo[]>([]);
loading = signal<boolean>(true);
error = signal<string | null>(null);
```

**Estados UI**:
1. Loading - Spinner animado
2. Error - Mensaje de error con ícono
3. Empty - Mensaje "sin proyectos"
4. Success - Grid de tarjetas

**Grid Responsive**:
```css
grid-cols-1        /* mobile */
md:grid-cols-2     /* tablet */
lg:grid-cols-3     /* laptop */
xl:grid-cols-4     /* desktop */
```

---

### 3. FooterComponent

**Ubicación**: `src/app/components/footer/footer.component.ts`  
**Tipo**: Standalone, sin dependencias

**Secciones**:
- Branding (Logo + descripción)
- Quick Links (Navegación)
- Social Media (3 iconos)
- Copyright (dinámico)

**Dynamic Year**:
```typescript
currentYear = new Date().getFullYear(); // 2026
```

---

### 4. GithubService

**Ubicación**: `src/app/services/github.service.ts`  
**Tipo**: Injectable (providedIn: 'root')  
**Singleton**: Sí

**Métodos Públicos**:
```typescript
// Fetch repos from GitHub
async fetchRepos(): Promise<void>

// Get color for programming language
getLanguageColor(language: string | null): string
```

**Métodos Privados**:
```typescript
// Filter and prioritize repos
private filterAndPrioritizeRepos(repos: GithubRepo[]): GithubRepo[]
```

**Language Colors Map**:
```typescript
{
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Kotlin': '#A97BFF',
  // ... 13 lenguajes en total
}
```

---

## 🚀 Build y Deploy

### Build de Producción

```bash
bun run build
```

**Output**:
- Directorio: `dist/k-forge-web/browser/`
- Archivos principales:
  - `index.html`
  - `main-[hash].js` (~164 KB raw / ~47 KB gzipped)
  - `styles-[hash].css` (~25 KB raw / ~3.7 KB gzipped)

**Optimizaciones Aplicadas**:
- Tree shaking
- Minificación
- Compresión Brotli/Gzip
- Code splitting
- Dead code elimination

### Deploy en Vercel

**Configuración** (`vercel.json`):
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist/k-forge-web/browser",
  "installCommand": "bun install",
  "framework": "angular",
  "rewrites": [
    { "source": "/((?!.*\\.).*)", "destination": "/index.html" }
  ]
}
```

**Build Time**: ~2-3 segundos  
**Deploy Time**: ~30-60 segundos  
**Edge Network**: Sí (Vercel Edge)

---

## 🔒 Configuración de Seguridad

### Content Security Policy (Recomendado)

Agregar en `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' https:; 
               font-src 'self' https://fonts.gstatic.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

### CORS (GitHub API)
- GitHub API permite CORS por defecto
- No requiere proxy

---

## 📊 Performance Metrics (Estimado)

### Lighthouse Score (Target)
- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 100
- **SEO**: 95+

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size
- **JavaScript**: ~47 KB (gzipped)
- **CSS**: ~3.7 KB (gzipped)
- **Fonts**: ~15 KB (Google Fonts)
- **Total**: < 70 KB (initial load)

---

## 🧪 Testing (Sugerido)

### Unit Tests
```bash
bun run test
```

### E2E Tests
```bash
bun run e2e
```

### Test Coverage Target
- Components: 80%+
- Services: 90%+
- Pipes/Directives: 100%

---

## 🔧 Scripts NPM/Bun

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  }
}
```

---

## 📈 Escalabilidad

### Features Futuras Sugeridas

1. **Autenticación**
   - Login con GitHub OAuth
   - Dashboard de miembros

2. **CMS**
   - Admin panel para gestionar proyectos
   - Editor de contenido

3. **Blog**
   - Artículos técnicos
   - Tutoriales

4. **Events**
   - Calendario de eventos
   - Registro a workshops

5. **Testimonios**
   - Carrusel de testimonios
   - Sistema de reviews

### Escalabilidad Técnica

- **Estado Global**: Considerar NgRx o Akita
- **Caché**: Implementar Service Worker
- **CDN**: Assets en CDN separado
- **SSR**: Angular Universal para SEO mejorado

---

## 🐛 Debugging

### VS Code Launch Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### Browser DevTools

**Angular DevTools Extension**:
- Inspeccionar componentes
- Ver signals en tiempo real
- Performance profiling

---

## 📚 Recursos y Referencias

### Documentación Oficial
- [Angular](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Bun](https://bun.sh)
- [GitHub API](https://docs.github.com/en/rest)

### Herramientas Útiles
- [Can I Use](https://caniuse.com) - Compatibilidad de browsers
- [Bundlephobia](https://bundlephobia.com) - Análisis de bundles
- [PageSpeed Insights](https://pagespeed.web.dev) - Métricas de performance

---

## 📄 Licencia y Créditos

**Proyecto**: K-FORGE Landing Page  
**Organización**: K-FORGE Club  
**Licencia**: MIT (sugerida)  
**Año**: 2026

---

## 🎓 Stack Completo

| Layer | Tecnología | Versión |
|-------|-----------|---------|
| Framework | Angular | 21.1.3 |
| Language | TypeScript | 5.7.2 |
| Styling | Tailwind CSS | 3.4.19 |
| Runtime | Bun | 1.3.8 |
| Build Tool | Angular CLI | 21.1.3 |
| Package Manager | Bun | 1.3.8 |
| Deployment | Vercel | Latest |
| Version Control | Git | - |

---

**Documento generado**: 7 de febrero de 2026  
**Status del proyecto**: ✅ Completado y funcionando  
**Servidor de desarrollo**: http://localhost:4200
