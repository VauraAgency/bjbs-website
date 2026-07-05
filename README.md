# BJBS Personal Website

A personal developer/maker landing page inspired by the DevSpace design language — built from scratch as a zero-build static site.

## Stack
- Plain HTML + [Tailwind CSS (CDN)](https://tailwindcss.com) — no npm install, no build step
- Vanilla JS for theme toggle, article grid, and category filters
- Dark/light mode with persistence

## Run locally
Just open `index.html` in a browser, or:

```sh
python3 -m http.server 8000
```

## Customize
- **Your info**: edit the hero section in `index.html` (name, headline, bio, links)
- **Articles**: edit the `ARTICLES` array in `js/main.js`
- **Projects & talks**: edit their sections in `index.html`
- **Avatar**: replace `images/avatar.svg` with your photo

## Deploy
Enabled for GitHub Pages — pushes to `main` go live automatically.
