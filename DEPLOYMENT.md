# Deployment Guide

This project deploys to **Vercel** as a single project with two services (the Next.js frontend and
the Express backend), using Vercel's `experimentalServices` feature. The database stays on **Neon**.

- **Database** – Neon (already provisioned)
- **Frontend + Backend** – one Vercel project, two services (`vercel.json`)

## How it's wired

`vercel.json` at the repo root defines the two services:

```json
{
  "experimentalServices": {
    "frontend": { "entrypoint": "frontend", "routePrefix": "/", "framework": "nextjs" },
    "backend":  { "entrypoint": "backend",  "routePrefix": "/api", "framework": "express" }
  }
}
```

- The frontend is served at `/`.
- The backend is served at `/api`, so all API routes are mounted under `/api`
  (`/api/health`, `/api/applications`, ...).
- Both services share one domain, so the browser calls the API at a relative `/api` path — **no CORS
  needed in production**.
- Vercel automatically injects `NEXT_PUBLIC_BACKEND_URL=/api` into the frontend, which the API client
  picks up. Locally you instead use `NEXT_PUBLIC_API_URL=http://localhost:4000/api`.

## 0. Push to GitHub

```bash
git init
git add .
git commit -m "Job application tracker"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

The `.gitignore` files keep `node_modules`, build output, and `.env` (your secrets) out of the repo.

## 1. Enable Services on the Vercel project

`experimentalServices` is an experimental feature, so it has to be turned on:

1. Go to https://vercel.com → **Add New** → **Project** and import the repo.
2. In the project settings, set the **Framework** to **Services** (required for `experimentalServices`
   to be picked up). If you don't see this option, the Services feature isn't enabled for your account
   yet — see the fallback at the bottom of this file.

## 2. Environment variables

Add this in the Vercel project's **Environment Variables**:

- `DATABASE_URL` – your Neon connection string (the same one in `backend/.env`)

You do **not** need to set `NEXT_PUBLIC_BACKEND_URL` (Vercel injects it) or `CLIENT_URL` (no CORS in
production since everything is one origin).

## 3. Deploy

Deploy from the Vercel dashboard. Vercel builds each service separately:

- `backend` → installs deps (which runs `prisma generate` via the `postinstall` script), builds with
  `tsc`, and runs the Express server. The build also applies migrations — make sure the build/start
  picks up `prisma migrate deploy` (it's part of the backend scripts).
- `frontend` → standard Next.js build.

Once deployed, check:

- `https://<your-app>.vercel.app/api/health` → `{"status":"ok"}`
- `https://<your-app>.vercel.app/applications` → the app loads and lists data

## Notes / gotchas

- `experimentalServices` is **experimental** and gated behind a Vercel "Services" permission. If your
  account doesn't have it, use the fallback below.
- If Prisma complains about a missing query engine on Vercel, add the platform to `binaryTargets` in
  `prisma/schema.prisma`, e.g. `binaryTargets = ["native", "debian-openssl-3.0.x"]`, and redeploy.
- The route prefix is **not** stripped, so the backend mounts its routes under `/api` (already done in
  `src/index.ts`).

## Fallback: Vercel (frontend) + Render (backend)

If the Services feature isn't available on your account, you can still deploy the classic way: frontend
on Vercel, backend on Render. A `render.yaml` blueprint is included for that. In that setup the backend
is reached cross-origin, so set `CLIENT_URL` on the backend and point the frontend's
`NEXT_PUBLIC_API_URL` at the Render URL (`https://<service>.onrender.com/api`).
