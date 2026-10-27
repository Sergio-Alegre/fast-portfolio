# AGENTS.md

Instructions for AI coding assistants working in this repository, for example when a photographer asks "set up my portfolio with these photos". Humans can read it too.

## What this is

Fast Portfolio is a static photography portfolio template built with [Eleventy](https://www.11ty.dev) 3. Photos exported into a folder become justified-row galleries with a lightbox; the site is plain HTML, CSS and one small script. Needs Node.js 20 or newer.

## Commands

```bash
npm install        # once
npm start          # dev server with live reload, http://localhost:8080
npm run build      # builds the site into dist/
npm run rebuild    # deletes dist/ first, then builds
```

`dist/` is generated: never edit it, and do not commit it.

## Where things are

| What | Where |
|---|---|
| All personal settings (name, URL, menu, footer links, analytics, PDF switch) | `src/_data/site.js` |
| Pages (Markdown with a short header) | `src/*.md`, `src/*/index.md` |
| Layouts, header, footer, shared `<head>` | `src/_includes/` |
| Galleries | `src/images/galleries/<folder>/` |
| Stylesheet and typeface | `src/css/` |
| Logo, favicons, footer icons | `src/images/icons/`, `src/images/social/` |
| Gallery engine and the `gallery` shortcodes | `eleventy/gallery.js` |
| Curriculum page and its optional PDF | `src/cv/index.md`, `eleventy/cv.js`, `eleventy/cv-pdf.js`, `docs/cv.md` |
| Docs | `docs/galleries.md`, `docs/deploy.md`, `docs/cv.md` |

## Rules

- **Personal data lives in `src/_data/site.js` only.** Layouts and includes read from it; do not hard-code a name, URL or address in a template.
- **Galleries:** one folder per gallery in `src/images/galleries/`, JPEG or PNG, long edge at least 2600 px, named with a zero-padded sequence (`portraits-001.jpg`, `portraits-002.jpg`...). The order is the order of the file names. Show a gallery with `{% gallery "portraits" %}` (the folder name, not a path) in a page that uses `layout: gallery.njk`. Details in `docs/galleries.md`.
- **Photos on pages** go through the `image` shortcode, which builds AVIF, WebP and JPEG. Do not paste raw `<img>` tags for photos.
- **Keep it light.** No front-end framework, no extra scripts, no requests to third-party servers (no font or icon CDNs). The typeface is self-hosted on purpose.
- **Licenses.** If you add or replace a typeface, an icon or a dependency, keep its license text next to the files and update `THIRD_PARTY_NOTICES.md`. Do not add assets whose license you cannot confirm. Brand logos (social icons) are trademarks: note that where you use them.
- **Do not touch** `LICENSE`, and do not delete license files such as `src/css/fonts/Jost/OFL.txt` or `src/images/social/LICENSES.txt`.
- Write code comments and docs in English, in the existing style.

## Helping someone set up their site

1. Ask for: their name, the final address of the site (or that they do not have one yet), where they will host it, and where their photos are.
2. Edit `src/_data/site.js` (name, `url`, menu, footer links, copyright holder).
3. Replace the example photos: delete `src/images/galleries/example-gallery/` and `example-series/`, add their folders, and update `src/index.md` and the other gallery pages to point at them.
4. Replace the placeholder logo and icons (`src/images/icons/`), or set `logo: null` in `site.js`.
5. Edit the About and Contact pages with their own text. Ask them for it; do not invent biography or contact details.
6. `src/privacy/index.md` is only a placeholder. Tell them they need their own privacy policy, and an imprint if their country requires one. Do not present generated text as legal advice.
7. Run `npm run build` and `npm start`, and check the pages and the galleries in a browser.

## Deploying

The options are in [`docs/deploy.md`](docs/deploy.md): their own hosting (build, then upload `dist/`), or GitHub Pages with the included workflow `.github/workflows/pages.yml` (needs a repository variable `SITE_URL` and Pages set to "GitHub Actions"). Ask which one they want and follow that guide.

**Ask before anything that publishes or cannot be undone**: pushing, making a repository public, enabling GitHub Pages, uploading to a server, or changing DNS. The DNS record is something only the owner of the domain can do; explain it, do not attempt it. Never put passwords, tokens or keys in the repository.

## Optional curriculum page

`/cv/` comes with the template, with a PDF built by Chrome, Edge or Chromium when one is installed (if not, the build carries on without the PDF). It is controlled by `cvPdf` in `site.js` and explained in `docs/cv.md`. If the person does not want a curriculum, set `cvPdf: false` and remove `src/cv/`.
