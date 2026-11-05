# Furn World

Furniture manufacturer website for Furn World (Chennai & Karaikal) with a 3D furniture builder and a full admin panel.

## Stack

- Next.js 16 (App Router, Cache Components, Turbopack), React 19, TypeScript, Tailwind v4
- 3D: three.js, @react-three/fiber, @react-three/drei (procedural sofa, lounge chair, cot, dining table)
- Animation: motion (Framer Motion), GSAP ScrollTrigger, Lenis smooth scroll
- Content store: `data/db.json` (created from `src/lib/seed.ts` on first run). Swap for a database by replacing `src/lib/db.ts`.
- Admin auth: signed cookie (jose). Credentials live in `data/db.json` (hashed) and can be overridden with env vars.

## Run locally

```bash
pnpm install
pnpm dev
```

Site: http://localhost:3000 · Admin: http://localhost:3000/admin

Default admin login is in `.env.example`. Change the password from Admin → Settings before going live.

## Admin panel

Everything on the site is editable at `/admin`:

- Products (photos, descriptions, materials, badges, featured, 3D builder link)
- Categories, hero slides, promo banners
- About page (story, numbers, values, process), FAQ page, Care & warranty page
- Testimonials, showrooms (addresses, phones, map), settings (contact, WhatsApp, announcement bar, SEO, show/hide prices)
- 3D builder fabrics, wood finishes and pricing
- Enquiries inbox (from product pages, the 3D builder and the contact form)

Uploaded images are resized to WebP and stored in `public/uploads/`.

## Deploy

Copy `.env.example` to `.env.local` (or set the same variables on the server) and set a long random `AUTH_SECRET`, your `SITE_URL`, and a strong `ADMIN_PASSWORD`.

```bash
pnpm build
pnpm start
```

The content file (`data/db.json`) and `public/uploads/` must live on persistent disk, so deploy to a VPS, Railway, Render, Fly.io or a Docker host rather than a serverless platform. Set `DATA_DIR` to move the content file elsewhere.

## SEO

Per-page metadata and canonical URLs, Open Graph images (site and per product), JSON-LD for the business, products, categories, breadcrumbs and FAQ, `sitemap.xml`, `robots.txt` and a web manifest are all generated automatically from the admin content.
