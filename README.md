# Thomex

An electronics & gadget storefront built with Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## What's in here

- `app/` — pages (currently just the homepage)
- `components/` — Header, Hero, category grid, flash sales, product cards, footer
- `data/products.ts` — demo product data. Swap these for real products later.

## Deploying with no terminal (GitHub website + Vercel)

1. **Get this code into a GitHub repo.**
   - Create a new repository on github.com (e.g. `thomex`).
   - Click **Add file → Upload files**, then drag the whole project folder in. Modern GitHub keeps the folder structure as long as you drag folders, not just loose files.
2. **Connect Vercel.**
   - Go to vercel.com, sign in with GitHub, click **Add New → Project**, and pick the `thomex` repo.
   - Vercel auto-detects Next.js — leave the defaults and click **Deploy**.
   - Vercel builds the site on its own servers, so you never need `npm install` or a terminal locally.
3. **Every future change** you push to GitHub (again, via the website's edit/upload buttons) automatically redeploys on Vercel within a minute or two.

## Editing files on GitHub's website

- Click any file in the repo → the pencil icon → edit → **Commit changes**.
- To add a new page, use **Add file → Create new file** and give it a path like `app/products/page.tsx`.
