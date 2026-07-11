# BJBS Personal Website

A personal developer/maker landing page inspired by the DevSpace design language — built from scratch as a zero-build static site.

## Stack
- Plain HTML + a precompiled Tailwind CSS build (`css/tailwind-built.css`) — no npm install needed to run the site, no runtime JS framework
- Vanilla JS for theme toggle, article grid, and category filters
- Dark/light mode with persistence

## Run locally
Just open `index.html` in a browser, or:

```sh
python3 -m http.server 8000
```

## Rebuilding CSS
`css/tailwind-built.css` is a compiled, purged Tailwind build — it replaced the `cdn.tailwindcss.com` script tag for performance (the CDN build is render-blocking and ships the whole framework as JS). If you add new Tailwind utility classes to any HTML/JS file, rebuild it with the standalone CLI (no npm/node required):

```sh
curl -sSL -o tailwindcss https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.17/tailwindcss-macos-arm64
chmod +x tailwindcss
./tailwindcss -i tailwind-input.css -o css/tailwind-built.css --config tailwind.config.js --minify
```

(`tailwind-input.css` is just `@tailwind base; @tailwind components; @tailwind utilities;` — recreate it if missing.) Custom theme colors live in `tailwind.config.js`, mirroring the old `js/theme-config.js` values.

## Customize
- **Your info**: edit the hero section in `index.html` (name, headline, bio, links)
- **Articles**: edit the `ARTICLES` array in `js/main.js`
- **Projects & talks**: edit their sections in `index.html`
- **Avatar**: replace `images/avatar.svg` with your photo

## Deploy
Enabled for GitHub Pages — pushes to `main` go live automatically.
