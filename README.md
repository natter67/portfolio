# nathanchan — portfolio

Personal site for Nathan Chan (Materials Science & Engineering, UIUC).
Next.js (App Router) + TypeScript + Tailwind CSS v4, exported as a fully static site.

The signature detail is the loader: the page is "polished" through a real
metallographic sequence (240 grit → 0.05 µm colloidal silica) and then "etched"
to reveal a grain structure and the name. Case studies are laid out like a
materials datasheet.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site → ./out
npx serve out        # preview the production build
```

The loader plays once per browser session on the home page. To see it again,
open a new tab or clear session storage. It never plays with reduced motion on.

## Edit content (no component changes needed)

| What | Where |
|---|---|
| Name, one-liner, email, toolkit, honors | `content/profile.ts` |
| "Now" line under the hero — **update monthly** | `now` in `content/profile.ts` |
| Flight log (map stops, order, why each stop matters) | `route` in `content/profile.ts` — `lat`/`lon` place the pin |
| Field notes (short posts, one problem each) | `content/notes.ts` — each becomes `/notes/<slug>/` |
| The Bench (your micrographs) | `bench` in `content/photos.ts` + the image in `scripts/process-photos.mjs` |
| "Updated <Month Year>" in the footer | `updated` in `content/profile.ts` |
| Projects, case studies, steel comparison table | `content/projects.ts` |
| Photo alt text, captions, crops, the photo strip | `content/photos.ts` |
| Resume PDF | `public/Nathan-Chan-Resume.pdf` (keep the phone number out) |

Filter chips are generated from project `categories`; a chip appears as soon as
one published project uses that category.

### Add a new project

1. Copy an entry in `content/projects.ts` and give it a unique `slug`.
2. Set `specimen` (display number), `label`, `title`, `outcome`, `categories`, `tags`.
3. Add a `caseStudy` (problem / approach / result / next) to get a `/work/<slug>/` page; leave it out for a card only.
4. Optional: `cover` and `gallery` photo ids (see below), `links` for code or reports.
5. Set `published: true`, run `npm run build`, and check the page.

### Add or change photos

Originals live in `_photo-intake/` (git-ignored; never committed or deployed).

1. Put the original in `_photo-intake/` and add it to `sources` in `scripts/process-photos.mjs`.
2. Run `node scripts/process-photos.mjs` — it auto-rotates, **strips all EXIF/GPS metadata**,
   and writes AVIF + WebP at 480–1600 px plus a blur placeholder to `public/photos/`.
3. Add alt text and a `Place, Year` caption for the new id in `content/photos.ts`.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo. The defaults are correct
   (framework: Next.js; `next.config.ts` sets `output: "export"`).
3. Deploy. Every push to `main` redeploys; other branches get preview URLs.

Any static host works too: upload `./out` after `npm run build`.

### Custom domain

1. Buy the domain (ideas: `nathanchan.dev`, `nathankchan.com`, `nathanchan.engineering` —
   check availability).
2. Vercel → Project → **Settings → Domains** → add it, then follow the DNS instructions
   (an `A` record for the apex domain, `CNAME` for `www`).
3. Update `siteUrl` in `content/profile.ts` so canonical URLs, the sitemap, and the
   LinkedIn preview image point at the real domain. Rebuild.

### Check the LinkedIn preview

After deploying, paste the URL into https://www.linkedin.com/post-inspector/ to see
(and refresh) the card. The image is `/og.png`, generated at build time in
`app/og.png/route.tsx`.

## Engineering notes

- **Static export:** no server. Images are pre-optimized by `scripts/process-photos.mjs`
  and served through `components/Picture.tsx` (AVIF → WebP, explicit sizes, lazy below the fold).
- **Fonts:** Big Shoulders (display), Funnel Sans (text), and Martian Mono (labels), all
  self-hosted by `next/font/google`. The TTFs in `assets/fonts/` (SIL Open Font License)
  are used to draw the OG image.
- **Grain textures** are Voronoi diagrams computed at build time (`lib/grains.ts`), so they
  cost no client JavaScript.
- **Work section** is a periodic table (`components/WorkTable.tsx`): hover or focus an
  element to read it in the key, click to open its datasheet. Families use steel temper
  colors. Each project's `symbol` lives in `content/projects.ts`.
- **Motion:** everything respects `prefers-reduced-motion`.

## Strava logbook (optional)

The home page can show a "Training load" section: 12 weeks of moving time and
totals by sport. It's fetched from Strava **at build time**, so no keys reach the
browser, and it shows no maps, routes, or start locations. Garmin has no personal
API, so turn on Garmin Connect → Strava auto-sync and Garmin activities flow in.

1. Create an app at https://www.strava.com/settings/api (website: your domain,
   callback domain: `localhost`).
2. Open, replacing `CLIENT_ID`:
   `https://www.strava.com/oauth/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=read,activity:read`
   Approve, then copy the `code=` value from the URL you land on.
3. Exchange it for a refresh token:
   ```bash
   curl -X POST https://www.strava.com/oauth/token \
     -d client_id=CLIENT_ID -d client_secret=CLIENT_SECRET \
     -d code=CODE -d grant_type=authorization_code
   ```
4. Put `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, and `STRAVA_REFRESH_TOKEN`
   (from that response) in `.env.local`, and in Vercel → Settings → Environment
   Variables. Never commit them.
5. To keep it fresh, add a Vercel Deploy Hook and call it daily (e.g. a
   scheduled GitHub Action that `curl -X POST`s the hook URL).

If the variables are missing or Strava is down, the section is simply hidden.
