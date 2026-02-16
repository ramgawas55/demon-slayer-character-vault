# Demon Slayer Character Vault

An animated, production-ready character showcase for Demon Slayer fans. It’s built with Next.js App Router, TailwindCSS, and Framer Motion, and ships with sensible defaults so it runs cleanly out of the box.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 to explore the vault.

## Build

```bash
npm run build
```

## Images

The site uses a local placeholder image at `public/characters/placeholder.svg` for every character, so you can launch instantly without external assets.

To add your own character art:

1. Add image files under `public/characters/{slug}/`:
   - `poster.jpg`
   - `g1.jpg`, `g2.jpg`, `g3.jpg`
2. Update each character entry in `src/data/characters.ts` to point to the new paths, for example:
   - `/characters/tanjiro-kamado/poster.jpg`
   - `/characters/tanjiro-kamado/g1.jpg`
3. Keep image sizes consistent (poster ~900x1200, gallery ~800x500) for best layout stability.

## Performance Notes

- Keep animation layers to a minimum. The global background plus one interactive layer is the intended ceiling.
- Prefer reduced motion fallbacks for page transitions and hover effects to stay smooth on low-power devices.
- Use WebP whenever possible and avoid oversized assets to prevent decode and layout jank.

## Image Optimization Workflow

1. Export posters at ~900x1200 and galleries at ~800x500.
2. Convert to WebP (quality 90–95) and place in `public/characters/{slug}/`.
3. Update the character image paths in `src/data/characters.ts`.
4. Rebuild to validate `next/image` sizing and caching.

## Add Character Data Safely

1. Duplicate an existing entry in `src/data/characters.ts` and update the slug, name, and metadata.
2. Keep the slug unique and consistent with the image folder name.
3. Ensure required fields are present: `faction`, `rank`, `technique`, `power`, `theme`, `uniformTheme`, `environment`, and `images`.
4. Confirm the new character renders in the grid and detail page without console errors.

## Admin Uploads

If you want to upload artwork through the admin screen:

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
