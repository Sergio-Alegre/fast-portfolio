# Fast Portfolio

A fast, static photography portfolio for [Eleventy](https://www.11ty.dev).
Export your photos from Lightroom into a folder, and the gallery builds itself.

- **Galleries from folders.** Drop the exported JPEGs in `src/images/galleries/<name>/`, add one line to a page, and you get a gallery. No manifest, no captions file, no admin panel.
- **Justified rows, no cropping.** Every photo keeps its original aspect ratio; rows are packed the way Flickr does it.
- **Modern formats.** Each photo is built as AVIF, WebP and JPEG at several sizes, and the browser picks the best one it supports.
- **Lightbox.** Click a photo to open it full screen ([PhotoSwipe](https://photoswipe.com)), with keyboard and swipe support.
- **Light by design.** No framework, one small script, self-hosted typeface, blur-up placeholders, the first row loaded eagerly and the rest lazily, and sizes computed per row so phones never download desktop-sized images.
- **One settings file.** Name, URL, menu, footer links and analytics live in [`src/_data/site.js`](src/_data/site.js).
- **Yours to host anywhere.** The output is plain static files in `dist/`.

The gallery engine comes from [sergioalegre.com](https://sergioalegre.com), which reaches 100 in all four PageSpeed Insights categories.

> Status: early (0.1). It works and it is what runs that site, but expect rough edges. Issues and suggestions are welcome.

---

## Why a static web page?

If this is not your first online portfolio, you have probably already used WordPress or a service like Squarespace. This is an alternative: a very compact, much faster HTML website that you can host almost anywhere. In the worst case, even at home. Better still, on any professional web hosting. I use Hetzner, but OVH and many others work just as well, with plans starting at around €2 a month and the uptime of a professional data center.

On top of that, because the site is static, the software only runs when you change something and generate it again. Your visitors always receive the same plain files. There are no plugins to update and nothing that can break: if it works today, it keeps working. It is solid as a rock. It is also very hard to get this kind of speed out of WordPress, and plain HTML is the safest option for compatibility.

For me, the main reasons are **zero maintenance** and **cheap, professional hosting**.

---

## Quick start

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
git clone https://github.com/Sergio-Alegre/fast-portfolio.git my-portfolio
cd my-portfolio
npm install
npm start
```

Open <http://localhost:8080>. The first build takes a few seconds per gallery because every image is converted; later builds reuse the results.

You can also click **Use this template** on GitHub to start your own repository.

---

## Make it yours

1. **Edit [`src/_data/site.js`](src/_data/site.js):** your name, final URL, menu, social links, legal links, copyright holder. Every layout, the footer, the sitemap, `robots.txt` and the web manifest read from it.
2. **Replace the example photos.** Delete `src/images/galleries/example-gallery/` and `example-series/` (they are generated abstract images) and add your own folders. See [docs/galleries.md](docs/galleries.md).
3. **Edit the pages** in `src/`: `index.md` (home gallery), `series/`, `selected/`, `about/`, `contact/`, `privacy/`. Each is a Markdown file with a short header.
4. **Replace the logo and the icons** in `src/images/icons/`: `logo.svg` is the square placeholder shown in the header (point `logo` in `site.js` at your own image, or set it to `null`), and the rest are the favicons and app icons.
5. **Write your own privacy policy.** `src/privacy/index.md` is only a placeholder.

### Typeface

The text uses [Jost](https://fonts.google.com/specimen/Jost), served from your own domain (`src/css/fonts/`), so visitors' browsers never contact a font service. To use another typeface, replace the `@font-face` blocks and the two variables at the top of [`src/css/fonts.css`](src/css/fonts.css). Remember to keep the license of whatever font you bundle next to its files.

### Footer icons

The footer shows icons for Instagram, YouTube, GitHub, email, WhatsApp and
Telegram, from [Simple Icons](https://simpleicons.org) (CC0) and
[Lucide](https://lucide.dev) (ISC). Choose which ones appear, and in what order,
in the `social` list of `site.js`. To add another, put an SVG in
`src/images/social/` and reference its name; keep its license in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). An entry without `icon` is
shown as a text link.

### Analytics

None by default. To use [Matomo](https://matomo.org) (cookie-less, respecting Do Not Track), set `analytics.matomo.url` in `site.js`.

---

## Adding a gallery

Short version: export to `src/images/galleries/my-gallery/` as `my-gallery-001.jpg`, `my-gallery-002.jpg`, and so on, then in any page:

```
{% gallery "my-gallery" %}
```

Use the `gallery.njk` layout for the page (`layout: gallery.njk` in its header) to get the wide container. The full export settings and the other shortcodes (`selectedWorks`, `image`, `youtube`) are in [docs/galleries.md](docs/galleries.md).

---

## Deploying

```bash
npm run build
```

builds the site into `dist/`. Upload that folder to any static host:

- **Netlify / Cloudflare Pages / Vercel:** build command `npm run build`, publish directory `dist`.
- **GitHub Pages:** publish `dist/`. The site must live at the root of a domain (not in a sub-path).
- **Apache hosting:** copy `dist/` to your web root. The included `.htaccess` adds compression and cache headers.
- **Any server:** `rsync -av --delete dist/ user@host:/path/to/webroot/`.

Remember to set `url` in `site.js` to the final address before deploying: it feeds the canonical links and the sitemap.

---

## Project structure

```
.eleventy.js            Eleventy configuration and the image and video shortcodes
eleventy/gallery.js     The gallery engine: gallery and selectedWorks shortcodes
config/.htaccess        Cache and compression rules for Apache hosts
src/_data/site.js       Your settings
src/_includes/          Layouts (base, gallery), header, footer, shared <head>
src/css/                Stylesheet, typeface and its license
src/js/gallery.js       Browser script: lightbox and image fade-in
src/images/galleries/   One folder per gallery
src/images/icons/       Favicons and app icons
src/images/social/      Footer icons (Instagram, YouTube, GitHub...)
src/*.md                Your pages
```

---

## Built with

[Eleventy](https://www.11ty.dev), [@11ty/eleventy-img](https://github.com/11ty/eleventy-img), [sharp](https://sharp.pixelplumbing.com), [justified-layout](https://github.com/flickr/justified-layout) and [PhotoSwipe](https://photoswipe.com). The typeface is [Jost](https://github.com/indestructible-type), and the footer icons come from [Simple Icons](https://simpleicons.org) and [Lucide](https://lucide.dev).

---

## License

[MIT](LICENSE) for the code. Third-party software and the typeface keep their own licenses, listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The example photos are abstract images generated for this template and have no restrictions.
