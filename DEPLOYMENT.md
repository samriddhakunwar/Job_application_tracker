# Deployment Guide

The app deploys as three pieces:

- **Database** – Neon (already provisioned)
- **Backend** – Render (Express API)
- **Frontend** – Vercel (Next.js)

## 0. Push to GitHub

Render and Vercel both deploy from a GitHub repo, so the project needs to be on GitHub first.

```bash
git init
git add .
git commit -m "Job application tracker"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

The `.gitignore` files keep `node_modules`, build output, and `.env` (your secrets) out of the repo.

## 1. Backend on Render

There is a `render.yaml` blueprint at the repo root, so the easiest path is:

1. Go to https://render.com → **New** → **Blueprint** and pick your GitHub repo.
2. Render reads `render.yaml` and creates the `job-tracker-backend` web service.
3. When prompted, fill in the environment variables (they are marked `sync: false` so they are
   never stored in git):
   - `DATABASE_URL` – your Neon connection string (same one in `backend/.env`)
   - `CLIENT_URL` – the Vercel URL from step 2, e.g. `https://your-app.vercel.app`
     (you can set a placeholder now and update it after the frontend is deployed)
4. Deploy. The build runs `prisma migrate deploy`, so the tables are created automatically.

Render gives you a URL like `https://job-tracker-backend.onrender.com`. Verify it with
`https://job-tracker-backend.onrender.com/health` → `{"status":"ok"}`.

> Note: the Render free plan sleeps the service after ~15 minutes of inactivity, so the first
> request after idle can take ~30–50 seconds to wake up. This is fine for a demo.

## 2. Frontend on Vercel

1. Go to https://vercel.com → **Add New** → **Project** and import the same GitHub repo.
2. Set **Root Directory** to `frontend` (since this is a monorepo).
3. Add an environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL, e.g. `https://job-tracker-backend.onrender.com`
4. Deploy. Vercel auto-detects Next.js and builds it.

> `NEXT_PUBLIC_API_URL` is read at build time, so if you change it later you must redeploy.

## 3. Connect the two

After both are live, make sure:

- Render's `CLIENT_URL` = your final Vercel domain (so CORS allows the frontend). Update it and
  redeploy the backend if needed.
- Vercel's `NEXT_PUBLIC_API_URL` = your final Render domain.

Then open the Vercel URL and the app is live end-to-end.
