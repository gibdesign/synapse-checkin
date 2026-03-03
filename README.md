# Checker

Gamified manual-verification streak app with public leaderboard and Telegram-visible identity.

## Key Routes

- Public / non-auth:
  - `/` global leaderboard
  - `/register`
  - `/login`
- Authenticated user:
  - `/dashboard`
  - `/dashboard/checkins`
  - `/profile/[username]`
- Staff/admin (guarded):
  - `/cs` customer service queue
  - `/admin` admin control plane

## Setup

1. Copy env template:
   - `cp .env.example .env`
2. Install and generate Prisma client:
   - `npm install`
   - `npm run prisma:generate`
3. Run app:
   - `npm run dev`

## Vercel Deployment

See **[DEPLOY.md](./DEPLOY.md)** for full steps including:

- Database setup (Neon / Supabase)
- Environment variables (`.env` → Vercel)
- Migrations and seed (10 example users)
- Cron for daily streak reset

## Notes

- No proof uploads are stored.
- Check-ins are pending until manual review.
- Leaderboard order is calculated, never manually assigned.

## UI Structure (shadcn-compatible)

- Reusable UI primitives live in `components/ui` (for example, `status-pill`, `shiny-border-button`, `ethereal-shadow`).
- Keep shared display components in `components/ui` so composition is predictable and future shadcn migration/additions stay consistent.
- Utility helpers such as `cn()` are kept in `lib/utils.ts`, which is the expected import path for shadcn-style components.

If a project does not already have `components/ui`, create it first before adding reusable UI components. This avoids scattered component locations and keeps design tokens/variants easier to maintain.
