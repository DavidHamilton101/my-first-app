# Architecture

## Overview

A Next.js web application connected to Supabase for data and auth, deployed on Vercel with automatic GitHub deployments.

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, TypeScript) | 16.2.2 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS | ^4 |
| Database | Supabase (PostgreSQL) | — |
| Auth | Supabase Auth | — |
| Hosting | Vercel | — |
| Version control | GitHub | — |

## Key Services

| Service | URL / ID |
|---------|----------|
| Live app | https://my-first-app-teal-two.vercel.app |
| GitHub repo | https://github.com/DavidHamilton101/my-first-app |
| Supabase project | https://xmvhgicwblccnufjzavi.supabase.co |
| Vercel dashboard | https://vercel.com/davidhamilton101s-projects/my-first-app |

## Project Structure

```
my-first-app/
├── app/                  # Next.js App Router — all pages and layouts
│   ├── layout.tsx        # Root layout (wraps every page)
│   ├── page.tsx          # Home page (/)
│   └── globals.css       # Global styles + Tailwind imports
├── public/               # Static assets (images, icons)
├── CLAUDE.md             # Claude Code context file
├── ARCHITECTURE.md       # This file
├── .env.local            # Local env vars (not committed)
├── next.config.ts        # Next.js config
├── tailwind.config.*     # Tailwind config
└── tsconfig.json         # TypeScript config
```

## Data Flow

```
Browser → Next.js (Vercel) → Supabase (PostgreSQL)
```

- Pages are React Server Components by default (fetch data server-side)
- Add `"use client"` at the top of a file to make it a Client Component (for interactivity)
- Supabase client is initialised using env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Environment Variables

| Variable | Where set |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` (local) + Vercel dashboard (production) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` (local) + Vercel dashboard (production) |

Run `vercel env pull .env.local` to sync production vars locally.

## Deployment

- **Local dev:** `npm run dev` → http://localhost:3000
- **Deploy:** `git add -A && git commit -m "message" && git push` → auto-deploys to Vercel
- **Manual deploy:** `vercel --prod`

## Database

- Managed in the Supabase Dashboard → Table Editor
- Row Level Security (RLS) is enabled by default — add policies for each table
- Migrations can be managed via the Supabase CLI (`supabase db diff`, `supabase db push`)

## Adding Features

1. **New page:** create `app/your-page/page.tsx`
2. **New component:** create `components/YourComponent.tsx`
3. **New database table:** use Supabase Dashboard → Table Editor, then update types
4. **Auth:** use `@supabase/ssr` helpers for server-side session management
