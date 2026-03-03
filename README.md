# Synapse CheckIn

Manual-verification check-in platform with public leaderboard and Telegram-visible identity.

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

1. Push repo to GitHub.
2. Import project in Vercel.
3. Set required env vars:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Connect managed Postgres.
5. Run migrations:
   - `npm run prisma:migrate`
6. Confirm post-deploy behaviors:
   - public leaderboard loads
   - user dashboard auth works
   - `/cs` and `/admin` role protection works
   - check-in approval updates streak/rank
   - daily reset script available: `npm run daily-reset`

## Notes

- No proof uploads are stored.
- Check-ins are pending until manual review.
- Leaderboard order is calculated, never manually assigned.
