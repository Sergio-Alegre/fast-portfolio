# Curriculum (`/cv/`)

The page lives in `src/cv/index.md` and uses its own layout,
`src/_includes/layouts/cv.njk` (no header, wider body). It is meant for artists
who want a printable curriculum that looks like the rest of their website.

The top of the page (logo, name, contact, photo) is plain HTML at the start of
`index.md`. Everything else (education, experience, languages...) is written
with the `cvsection` shortcode, whose logic is in `eleventy/cv.js`.

## `cvsection` syntax

One entry per line, in the form `label | text`:

```
{% cvsection "Education" %}
2016–2019 | Bachelor of Arts in Photography, Example University (City, Country).
2014–2016 | Course in Documentary Photography, Example School of Art (City).
{% endcvsection %}
```

- **Label** (first column): years, a language, etc. It is separated from the text
  by ` | ` (a bar with a space on each side).
- **Long entries** can be split over several lines: a line that starts with
  spaces continues the previous one.
- **No label:** if no entry of a section has ` | `, the section is drawn as a list
  of paragraphs, without the label column. The two forms cannot be mixed in one
  section: the build stops with an error.
- **Text:** HTML is escaped, so you do not need to worry about `&` or `<`.
  Markdown links, `[text](url)`, work; absolute ones (`https://…`) open in a new
  tab.
- **Between sections**, leave a blank line.

Each section produces `<section><h2>…</h2><ul class="cv-list">…</ul></section>`.
The styles are in the CURRICULUM sections of `src/css/styles.css`.

## Why not a Markdown table

Every entry is "label + paragraph", not tabular data. A Markdown table forces a
header row, produces a `<table>` with no real meaning for a curriculum, and long
cells on one line are unreadable in the source file. The shortcode keeps a list
(`<ul>`), better for screen readers, with a source that is easy to edit.

## The PDF (`/curriculum.pdf`)

The PDF is not a source file: it is generated at the end of the build by
printing the page `/cv/` with a headless Chrome, Edge or Chromium, so it has the
look of the page, in A4. There is nothing to edit by hand.

It is **on by default** and it **never breaks the build**:

- With Chrome, Edge or Chromium installed, `npm run build` creates
  `dist/curriculum.pdf` and the page shows a "Download PDF" link.
- Without one (for example on Netlify, Vercel or Cloudflare Pages, which do not
  include a browser), the build prints a warning, carries on without the PDF and
  hides the link.
- To turn it off completely, set `cvPdf: false` in `src/_data/site.js`.
- To make a missing PDF an error, set `CV_PDF_REQUIRED=1` when you build. Use it
  before a deploy that syncs `dist/` with deletion (such as `rsync --delete`):
  without a PDF in `dist/`, the old one would be removed from the server.

The script is Node.js, not a shell script, so it is the same on every system.
Safari and Firefox cannot be used: unlike Chrome, Edge and Chromium, they cannot
print a page to PDF from the command line.

### Which browser it uses

It looks for the browser in its usual place:

| System | Looked up in |
|---|---|
| Windows | Chrome or Edge in `Program Files`, `Program Files (x86)` or `%LocalAppData%` |
| macOS | Google Chrome or Microsoft Edge in `/Applications` |
| Linux | `/usr/bin/google-chrome`, `chromium`, `chromium-browser` or `microsoft-edge` |

If yours is somewhere else, set the `CV_PDF_BROWSER` environment variable:

```powershell
# Windows (PowerShell)
$env:CV_PDF_BROWSER = "C:\Program Files\Google\Chrome\Application\chrome.exe"
npm run build
```

```bash
# macOS
CV_PDF_BROWSER="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run build

# Linux
CV_PDF_BROWSER=/usr/bin/chromium npm run build
```

On Linux as root or inside a container (for example in a CI service), Chrome
needs the `--no-sandbox` flag. There is a commented line for it in
`renderPdf()`, in `eleventy/cv-pdf.js`; use it only in an environment you trust.

### How it works

- **Print styles:** the CURRICULUM - PRINT section of `src/css/styles.css`
  (`@page` A4 with margins and `@media print`). It hides the "Download PDF" link
  and the footer. The same styles apply when you print the page with Ctrl+P.
- **Only when something changes:** a hash is kept of the page HTML, the CSS, the
  images and fonts it uses, and `cv-pdf.js`. If nothing changed, the PDF saved in
  `.cache/` is reused (it survives `npm run rebuild`) and the build does not need
  the browser.
- **If there is no browser** and the PDF has to be generated, it is skipped with a
  warning (or the build fails if `CV_PDF_REQUIRED=1`).
- **Isolated render:** `dist/` is served from a temporary local server. For the
  render, the analytics code is removed (printing must not count as a visit) and
  the internal links become absolute, pointing to the `url` in `site.js`.
- **To check the result**, open `dist/curriculum.pdf`.
