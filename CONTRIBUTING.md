# Contributing to K-FORGE Web

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/K-Forge/k-forge-web.git
cd k-forge-web
bun install
bun start
```

## Project Conventions

- **Components**: Standalone, inline templates, no `NgModule`
- **State**: Angular Signals (no RxJS subjects for UI state)
- **Styles**: Tailwind utility classes — avoid custom CSS unless necessary
- **Control flow**: Use `@if`/`@for`/`@empty` (not `*ngIf`/`*ngFor`)
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

## Branch Naming

```
feature/add-section-name
fix/mobile-menu-toggle
docs/update-readme
```

## Adding a New Section

1. Create `src/app/components/your-section/your-section.component.ts` (standalone, inline template)
2. Import `FadeInDirective` for scroll animations
3. Add the component to `app.ts` imports and template
4. Use the existing design tokens (`midnight`, `surface`, `violet-primary`, etc.)

## Pull Requests

1. Fork the repo and create your branch from `main`
2. Make your changes with clear, small commits
3. Ensure `bun run build` succeeds with no errors
4. Open a PR with a clear description of what changed and why
