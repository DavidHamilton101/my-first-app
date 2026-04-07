# My First App

## Tech Stack
- **Framework:** Next.js (App Router, TypeScript)
- **Database:** Supabase (PostgreSQL) — project: xmvhgicwblccnufjzavi
- **Hosting:** Vercel
- **CSS:** Tailwind CSS

## Development
- Run `npm run dev` to start the dev server at http://localhost:3000
- Push to GitHub to auto-deploy to Vercel
- Database tables are managed in the Supabase Dashboard

## Environment
- `.env.local` must exist with Supabase URL and anon key (see Project Settings > API in Supabase)
- Run `npm install` if node_modules is missing
- Run `vercel env pull .env.local` to sync env vars from Vercel if the file is missing
