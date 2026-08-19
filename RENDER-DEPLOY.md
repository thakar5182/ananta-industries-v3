# Ananta Industries — Render Demo Deployment

This package is prepared for a temporary client demo on Render.

## Project root
The folder that contains this file also contains `package.json`, `server.js`, and `render.yaml`. Open THIS folder in Kilo Code / VS Code.

## Local verification
```powershell
npm install
npm run verify
npm start
```
Then open `http://localhost:4173`. Health check: `http://localhost:4173/healthz`.

## Render
Push this folder to GitHub, then in Render choose **New > Blueprint** and select the repository. Render will read `render.yaml` automatically.

The blueprint configures:
- Node web service
- Free plan
- `npm install --omit=dev`
- `npm start`
- `NODE_ENV=production`
- a generated `APP_SECRET`
- `/healthz` health check

## Demo storage warning
The app currently stores business data in `data/store.json`. This is OK for a temporary demo, but Render's free filesystem must not be treated as permanent business storage. For production use, migrate data to PostgreSQL/Supabase or another persistent database.

## Windows app
Electron/Windows scripts are preserved. Render installs only production dependencies for the web service, so Electron is not downloaded during Render build.
