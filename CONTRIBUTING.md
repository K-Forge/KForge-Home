# Contributing to K-FORGE Web

Gracias por aportar a K-FORGE.

## Antes de empezar

La configuración y comandos de arranque viven en el README principal:

- [README.md](README.md)

Este documento se enfoca solo en flujo de contribución y estándares del código.

## Convenciones del proyecto

- **Arquitectura Angular:** componentes standalone con template inline (sin `NgModule`).
- **Estado UI:** usar **signals** (`signal`, `computed`) para estado local de componentes.
- **Servicios:** lógica de datos/integraciones en `src/app/services` (ej. GitHub, i18n), no en componentes.
- **Plantillas:** usar control flow moderno (`@if`, `@for`, `@empty`), evitar `*ngIf`/`*ngFor` nuevos.
- **Estilos:** usar utilidades Tailwind y tokens existentes (`midnight`, `surface`, `surface-light`, `violet-primary`, `text-*`).
- **Diseño consistente:** evitar colores hardcodeados o estilos inline nuevos si ya existe token/utilidad equivalente.
- **i18n obligatorio:** todo texto visible nuevo debe agregarse en `es` y `en` dentro de `src/app/services/i18n.service.ts`.
- **Navegación por secciones:** si agregas una sección, actualiza orden e IDs en `src/app/app.ts` (`navLinks` + observer IDs).

## Commits (fáciles y consistentes)

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios de documentación
- `refactor:` mejora interna sin cambiar comportamiento
- `style:` cambios de formato/estilo sin lógica
- `chore:` tareas de mantenimiento

Ejemplos:

```bash
feat(nav): add active state for mobile links
fix(i18n): add missing es/en key for team subtitle
docs(readme): update quick start wording
```

## Branch naming (simple e intuitivo)

Formato recomendado:

```bash
<type>/<scope>-<short-description>
```

Reglas:

- Todo en minúsculas.
- Usar `kebab-case`.
- Descripción corta y clara (3–6 palabras).
- Reusar `type` de Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `chore`, `style`).

Ejemplos:

```bash
feat/nav-active-state
fix/contact-form-validation
docs/update-contributing-guide
refactor/projects-card-structure
chore/deps-angular-21-1
```

## Agregar una nueva sección

1. Crear `src/app/components/<section>/<section>.component.ts` como standalone.
2. Mantener template inline y estilos con Tailwind + tokens del proyecto.
3. Reusar `FadeInDirective` si aplica animación de entrada.
4. Registrar el componente en `src/app/app.ts` (imports + orden del template).
5. Agregar textos en `i18n.service.ts` para `es` y `en`.

## Pull Requests

1. Crear rama desde `main` con el formato indicado.
2. Hacer commits pequeños y descriptivos.
3. Validar localmente antes de abrir PR:

```bash
bun run build
```

4. En la descripción del PR incluir:
   - qué cambió,
   - por qué cambió,
   - evidencia visual (capturas/gif) si hubo cambios UI.
