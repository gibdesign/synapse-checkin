# Deploy Checker to Vercel

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres)

---

## Step 1: Push to GitHub

```bash
cd /Users/jovecreative/CheckIn
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Step 2: Create Database (if needed)

### Option A: Neon (recommended)

1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string (e.g. `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`)
3. Use the **pooled** connection string for serverless (has `-pooler` in the host)

### Option B: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → Database → Connection string (URI)
3. Use the **Transaction** pooler URL for serverless

---

## Step 3: Run Migrations & Seed Locally

Before deploying, run migrations against your production database:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="postgresql://..."

# Run migrations
npm run prisma:migrate

# Seed the database (10 users + admin + cs)
npm run prisma:seed
```

---

## Step 4: Import Project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select the `CheckIn` folder if it's inside a monorepo, or the root if it's the whole repo
4. **Do not deploy yet** – add env vars first

---

## Step 5: Add Environment Variables in Vercel

In your Vercel project: **Settings → Environment Variables**

Add these for **Production**, **Preview**, and **Development**:

| Variable | Value | Notes |
|----------|-------|------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?sslmode=require` | Your Postgres connection string |
| `AUTH_SECRET` | Random string (32+ chars) | Generate with: `openssl rand -base64 32` |
| `AUTH_URL` | `https://synapse.vercel.app` | Use after adding custom domain |
| `CRON_SECRET` | Random string | For daily-reset cron job (optional) |

### Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and paste it as `AUTH_SECRET`.

---

## Step 6: Deploy

1. Click **Deploy**
2. Add custom domain **synapse.vercel.app**:
   - **Settings → Domains → Add** → `synapse.vercel.app`
   - If "already in use": remove it from the other project first (Vercel dashboard → that project → Domains → Remove)
3. `AUTH_URL` is set to `https://synapse.vercel.app`
4. Redeploy after adding the domain

---

## Step 7: Optional – Daily Reset Cron

To run the daily streak reset automatically:

1. In Vercel: **Settings → Cron Jobs** (or use Vercel's cron)
2. Add a cron that calls: `GET https://your-app.vercel.app/api/jobs/daily-reset`
3. Add header: `Authorization: Bearer YOUR_CRON_SECRET`
4. Schedule: `0 0 * * *` (midnight UTC daily)

Or use an external cron service (e.g. cron-job.org) to hit the endpoint with the `CRON_SECRET` header.

---

## Verify Deployment

- [ ] Leaderboard loads at `/`
- [ ] Register a new user
- [ ] Log in and see dashboard
- [ ] Admin: `admin@example.com` / `password123` → `/admin`
- [ ] CS: `cs@example.com` / `password123` → `/cs`

---

## Troubleshooting

**Build fails with Prisma error**
- Ensure `DATABASE_URL` is set in Vercel
- Check that the connection string uses `?sslmode=require` for Neon/Supabase

**Auth not working**
- Verify `AUTH_SECRET` is set and `AUTH_URL` matches your deployed URL
- Clear cookies and try again

**Leaderboard empty**
- Run `npm run prisma:seed` against your production DB
- Check that users have `leaderboardVisible: true` and `accountStatus: ACTIVE`
