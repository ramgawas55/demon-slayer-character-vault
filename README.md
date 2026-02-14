# Demon Slayer Character Vault

Production-ready, animated character showcase built with Next.js App Router, TailwindCSS, and Framer Motion.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Placeholder Images

This project uses a single local placeholder image at `public/characters/placeholder.svg` for all characters so the site runs immediately without external assets.

To replace with your own images:

1. Add image files under `public/characters/{slug}/`:
   - `poster.jpg`
   - `g1.jpg`, `g2.jpg`, `g3.jpg`
2. Update each character entry in `src/data/characters.ts` to point to the new paths, for example:
   - `/characters/tanjiro-kamado/poster.jpg`
   - `/characters/tanjiro-kamado/g1.jpg`
3. Keep image sizes consistent (poster ~900x1200, gallery ~800x500) for best layout stability.

## Admin Uploads

1. Set `ADMIN_PASSWORD` and `BLOB_READ_WRITE_TOKEN` in your environment.
2. Run the app locally or deploy it.
3. Visit `/admin/uploads`, enter the password, and upload a poster plus gallery images.
4. Uploaded URLs are stored in `src/data/overrides.json` and used automatically.

## Git Init + Push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Deploy to Vercel

1. Push your repository to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Framework preset: Next.js.
4. Build command: `npm run build`
5. Environment variables:
   - `ADMIN_PASSWORD`
   - `BLOB_READ_WRITE_TOKEN`
6. Deploy.

## Deploy to Render (Web Service)

1. Push your repository to GitHub.
2. Create a new Web Service in Render.
3. Build command: `npm run build`
4. Start command: `npm run start`
5. Set Node version in Render to 18+.
6. Add environment variables:
   - `ADMIN_PASSWORD`
   - `BLOB_READ_WRITE_TOKEN`
7. Deploy.
