# 🚀 GUÍA RÁPIDA DE DEPLOY - K-FORGE

## ✅ Proyecto Completado

Tu landing page de K-FORGE está lista para producción con:
- Angular 17+ (Standalone Components)
- Tailwind CSS 3
- Integración con GitHub API
- Dark Mode minimalista
- Diseño responsive

## 📋 Comandos Principales

### Desarrollo Local
```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run ng serve

# Abrir en navegador
# http://localhost:4200
```

### Build de Producción
```bash
# Compilar para producción
bun run build

# Los archivos compilados estarán en: dist/k-forge-web/browser/
```

## 🚀 Deploy en Vercel (Recomendado)

### Método 1: GitHub + Vercel (Automático)

1. **Inicializa Git en el proyecto:**
   ```bash
   cd /Users/13rianvargas/Documents/GitHub/k-forge-web/k-forge-web
   git init
   git add .
   git commit -m "Initial commit: K-FORGE landing page"
   ```

2. **Sube a GitHub:**
   ```bash
   # Crea un repo en GitHub primero, luego:
   git remote add origin https://github.com/TU-USUARIO/k-forge-web.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Haz login con GitHub
   - Click en "New Project"
   - Importa tu repositorio `k-forge-web`
   - Vercel detectará automáticamente Angular
   - **Importante**: En "Build and Output Settings", configura:
     - Framework Preset: `Angular`
     - Build Command: `bun run build`
     - Output Directory: `dist/k-forge-web`
     - Install Command: `bun install`
   - Click en "Deploy"

### Método 2: CLI de Vercel (Directo)

```bash
# Instalar Vercel CLI globalmente
bun add -g vercel

# Desde el directorio del proyecto
cd /Users/13rianvargas/Documents/GitHub/k-forge-web/k-forge-web

# Deploy
vercel

# Sigue los prompts:
# - Set up and deploy? Yes
# - Scope: Tu cuenta
# - Link to existing project? No
# - Project name: k-forge-web
# - Framework: Angular
# - Settings detected: Confirma
```

## 📁 Estructura Final del Proyecto

```
k-forge-web/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── hero/
│   │   │   │   └── hero.component.ts
│   │   │   ├── projects/
│   │   │   │   └── projects.component.ts
│   │   │   └── footer/
│   │   │       └── footer.component.ts
│   │   ├── services/
│   │   │   └── github.service.ts
│   │   ├── models/
│   │   │   └── github-repo.interface.ts
│   │   ├── app.ts
│   │   └── app.config.ts
│   ├── styles.css
│   └── index.html
├── tailwind.config.js
├── vercel.json
├── angular.json
├── package.json
└── README.md
```

## 🎨 Personalizaciones Post-Deploy

### Cambiar Email de Contacto
Busca y reemplaza `k-forge@university.edu` por tu email real en:
- `src/app/components/hero/hero.component.ts`
- `src/app/components/footer/footer.component.ts`
- `src/app/app.ts`

### Modificar Organización de GitHub
En `src/app/services/github.service.ts`, cambia:
```typescript
private readonly GITHUB_API = 'https://api.github.com/users/K-Forge/repos';
```

### Ajustar Proyectos Prioritarios
En `src/app/services/github.service.ts`, modifica:
```typescript
private readonly PRIORITY_REPOS = ['K-APP', 'Gretta', 'Tienda-K', 'KomidaGPT'];
```

## 🔧 Troubleshooting

### Error: GitHub API Rate Limit
- La API pública de GitHub tiene límite de 60 requests/hora
- Solución: Agregar un token de GitHub en las headers del fetch

### El servidor no inicia
```bash
# Verifica que Bun esté instalado
bun --version

# Reinstala dependencias
rm -rf node_modules
bun install
```

### Tailwind no aplica estilos
- Verifica que `tailwind.config.js` tenga los paths correctos
- Revisa que `styles.css` tenga las directivas `@tailwind`

## 📞 Soporte

Para más ayuda:
- [Documentación de Angular](https://angular.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com)
- [Documentación de Vercel](https://vercel.com/docs)
- [GitHub API Docs](https://docs.github.com/en/rest)

---

✨ ¡Tu landing page está lista para brillar!
