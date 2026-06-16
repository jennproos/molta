# Molta Bakery — Web

The [Molta Bakery](https://moltabakery.com/) website, built with [Next.js](https://nextjs.org) (App Router), TypeScript, and React. It is configured for [static export](https://nextjs.org/docs/app/guides/static-exports), so the build produces a fully static site that is hosted on S3 and served through CloudFront.

> **Note:** This project uses a newer version of Next.js with breaking changes from older releases. Before writing code, read the relevant guide in `node_modules/next/dist/docs/` — see [AGENTS.md](AGENTS.md).

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. Pages auto-update as you edit files.

## Scripts

- `npm run dev` — start the local development server
- `npm run build` — build the static export into `out/`
- `npm run start` — serve a production build locally
- `npm run lint` — run ESLint

## Project Structure

```
web/
├── app/          # App Router: pages, layout, global styles
│   ├── page.tsx        # Home page composition
│   ├── layout.tsx      # Root layout, metadata, fonts
│   ├── globals.css     # Global styles
│   └── icon.svg        # Favicon
├── components/   # React components (Nav, Hero, Ticker, About, Markets, Footer, ScrollReveal)
├── data/         # Content data (markets.ts — pop-up / farmers market schedule)
├── public/       # Static assets (images)
└── next.config.ts # Static export + unoptimized images
```

Fonts (BBH Sans Hegarty, SN Pro) are loaded from Google Fonts in `app/layout.tsx`.

## Editing Content

The market / pop-up schedule shown on the site is defined in [`data/markets.ts`](data/markets.ts). Update that array to change upcoming dates.

## Deployment

Deployment is automated via GitHub Actions. Pushing changes under `web/` to the `main` branch builds the static export, syncs `out/` to S3, and invalidates the CloudFront cache. See the [root README](../README.md) for the full infrastructure and deployment details.
