# Fast Portfolio

A fast, static photography portfolio for [Eleventy](https://www.11ty.dev).
Export your photos from your photo editing software into a folder, and the gallery builds itself.

You have exported and organized pictures into folders many, many times in your life, but building online galleries, not so often. So let's use the skill with the least mental friction to publish our work online.

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

## The gallery function and shortcode

The biggest novelty of this implementation is the shortcode: you just name a folder. Put your pictures in a subfolder of `src/images/galleries/` and write the name of that subfolder in the page:

```
{% gallery "portraits" %}
```

That is the whole thing. The engine looks for the folder `src/images/galleries/portraits/`, so you only write the name of the subfolder, never the path.

Export the pictures from your favorite photography software straight into that folder, ideally adding a three-digit number to the file names so you know in which order they will appear:

```
src/images/galleries/portraits/
  portraits-001.jpg
  portraits-002.jpg
  portraits-003.jpg
  ...
```

When the site is built, it calculates the grid by itself, in justified rows that show every picture complete: nothing is cropped away. It then builds the gallery without you ever going through the settings pages of WordPress, creating online galleries, dragging and dropping, or any of the workflow you probably already know. This is just exporting into a folder, that's it.

Here is a complete page, the one that holds a home gallery. The `gallery.njk` layout gives the gallery its wide container:

```
---
layout: gallery.njk
title: Portraits
---
# Portraits

{% gallery "portraits" %}
```

The files can be JPEG or PNG. To add, remove or reorder pictures, change the files in the folder and build again; no page needs to be edited. Export settings, alt texts and the other shortcodes are in [docs/galleries.md](docs/galleries.md).

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
- **GitHub Pages:** the included workflow (`.github/workflows/pages.yml`) builds and publishes the site on every push to `main`. To turn it on: in *Settings > Pages*, set the source to **GitHub Actions**, and in *Settings > Secrets and variables > Actions > Variables* add a variable `SITE_URL` with the final address of your site. For a custom domain, add a `CNAME` record at your domain provider pointing to `YOUR-USER.github.io`, then enter the domain in *Settings > Pages*. The site must live at the root of a domain (not in a sub-path), and the repository must be public on the free plan.
- **Apache hosting:** copy `dist/` to your web root. The included `.htaccess` adds compression and cache headers.
- **Any server:** `rsync -av --delete dist/ user@host:/path/to/webroot/`.

Remember to set `url` in `site.js` to the final address before deploying: it feeds the canonical links and the sitemap.

---

## Project structure

```
.eleventy.js            Eleventy configuration and the image and video shortcodes
eleventy/gallery.js     The gallery engine: gallery and selectedWorks shortcodes
eleventy/cv.js          The cvsection shortcode of the curriculum page
eleventy/cv-pdf.js      Optional: builds /curriculum.pdf with Chrome, Edge or Chromium
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

## Use it also for your curriculum

There is a secondary tool built into this template that creates a curriculum at `example.com/cv/`. That way you can send a fast, professional-looking link by email or WhatsApp, or just tell it to people in person.

By default it takes its look from the settings of the website, but you can edit the CSS as you please. It also generates a PDF: you can download it yourself and send it by email, or the people who receive your link can save it in A4 format and print it. The PDF is built with Chrome, Edge or Chromium; if none is installed, the page still works and the PDF is simply skipped.

I hope it helps you get in contact about new job positions.

The page is `src/cv/index.md`, and [docs/cv.md](docs/cv.md) explains how to write it, how the PDF works and how to turn it off.

---

## Built with

[Eleventy](https://www.11ty.dev), [@11ty/eleventy-img](https://github.com/11ty/eleventy-img), [sharp](https://sharp.pixelplumbing.com), [justified-layout](https://github.com/flickr/justified-layout) and [PhotoSwipe](https://photoswipe.com). The typeface is [Jost](https://github.com/indestructible-type), and the footer icons come from [Simple Icons](https://simpleicons.org) and [Lucide](https://lucide.dev).

---

## License

[MIT](LICENSE) for the code. Third-party software and the typeface keep their own licenses, listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The example photos are abstract images generated for this template and have no restrictions.
