# K-FORGE

> Landing page for K-FORGE — university software development club.

Built with **Angular 21** (standalone components + signals) • **Tailwind CSS 3** • **Bun** • Deployed on **Vercel**.

---

## Quick Start

```bash
bun install
bun start          # dev server → http://localhost:4200
bun run build      # production build → dist/
```

## Project Structure

```
src/app/
├── components/
│   ├── hero/          # Hero section — title, tagline, CTAs
│   ├── about/         # About the club — mission, activities
│   ├── projects/      # GitHub repos grid (dynamic via API)
│   ├── team/          # Team members (dynamic via GitHub org API)
│   ├── contact/       # Contact form (FormSubmit integration)
│   └── footer/        # Footer with links + social
├── directives/
│   └── fade-in/       # IntersectionObserver scroll animations
├── models/            # TypeScript interfaces
├── services/
│   └── github.service # API calls with HttpClient + caching
├── app.ts             # Root component (header + mobile menu)
└── app.config.ts      # App providers
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Angular 21 (standalone, signals, `@if`/`@for`) |
| Styles | Tailwind CSS 3 (custom dark+violet palette) |
| Package Manager | Bun |
| API | GitHub REST API (repos + org members) |
| Contact Form | [FormSubmit](https://formsubmit.co) (free, no backend) |
| Deploy | Vercel |

## Design Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `midnight` | `#0A0A0F` | Main background |
| `surface` | `#12121A` | Cards, alternate sections |
| `surface-light` | `#1A1A2E` | Borders, hover states |
| `violet-primary` | `#8B5CF6` | Primary accent |
| `violet-glow` | `#A78BFA` | Hover, decorative glows |
| `violet-deep` | `#6D28D9` | Pressed states, gradients |

## Deploy to Vercel

```bash
# Option 1: Push to GitHub → connect repo in vercel.com
# Option 2: CLI
bunx vercel --prod
```

The `vercel.json` is pre-configured with Bun build commands and SPA routing.

## Configuration

**Contact form:** Update the email in `src/app/components/contact/contact.component.ts`:
```typescript
private readonly DESTINATION_EMAIL = 'your-real-email@domain.com';
```

**GitHub org:** Update the org name in `src/app/services/github.service.ts`:
```typescript
private readonly ORG = 'K-Forge';
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) — K-FORGE 2026
