"use strict";

/**
 * Image gallery system.
 *
 * Usage in any .md page:
 *   {% gallery "folder-name" %}
 *     -> Renders every photo in src/images/galleries/folder-name/ (in file
 *        name order, which matches the numeric order thanks to the zero
 *        padding in the exported file names) as a grid of
 *        justified rows, with a lightbox (PhotoSwipe) on click.
 *   {% gallery "folder-name", "Alt text prefix" %}
 *     -> Same, with "Alt text prefix 1", "Alt text prefix 2"... as the alt
 *        text of the photos (default prefix: "Photograph").
 *
 *   {% selectedWorks [
 *        { gallery: "folder-name", url: "/destination/" },
 *        { gallery: "other-folder", url: "/other/", cover: 3 }
 *      ] %}
 *     -> Renders a curated grid of covers (one photo per entry) that link to
 *        the given URL instead of opening the lightbox. "cover" is optional
 *        (photo number, starting at 1); by default the first photo is used.
 *
 * See docs/galleries.md for the export naming convention.
 */

const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const justifiedLayout = require("justified-layout");

const GALLERIES_DIR = path.join(__dirname, "..", "src", "images", "galleries");
const GALLERY_OUTPUT_DIR = "./dist/img/galleries/";
const GALLERY_URL_PATH = "/img/galleries/";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

// Widths generated per use. The grid uses the small ones, the lightbox the
// large ones. Widths larger than the source photo are never generated.
const GRID_WIDTHS = [400, 800, 1200];
const LIGHTBOX_WIDTHS = [1200, 1920, 2560];

const FORMAT_OPTIONS = {
  jpeg: { quality: 82, mozjpeg: true },
  webp: { quality: 80 },
  avif: { quality: 50 },
};

// "Representative" container widths, used only to decide how many photos fit
// in a row at each breakpoint. The real size on screen is resolved
// continuously by CSS (flexbox), so these values do not need to match any
// actual width: they only affect how photos are GROUPED into rows.
const BREAKPOINTS = [
  { key: "mobile", containerWidth: 380, targetRowHeight: 150 },
  { key: "tablet", containerWidth: 900, targetRowHeight: 260 },
  { key: "desktop", containerWidth: 1200, targetRowHeight: 300 },
];

const ROW_GAP_PX = 8;

// widowLayoutStyle "justify" stretches the last, incomplete row to full width
// like the others, so it needs no special case when rendering.
const JUSTIFIED_OPTIONS = {
  boxSpacing: ROW_GAP_PX,
  containerPadding: 0,
  widowLayoutStyle: "justify",
};

// --- File helpers ---

function getGalleryDir(folderName) {
  return path.join(GALLERIES_DIR, folderName);
}

function getGalleryFiles(folderName) {
  const dir = getGalleryDir(folderName);
  if (!fs.existsSync(dir)) {
    throw new Error(
      `[gallery] The folder "src/images/galleries/${folderName}" does not exist. ` +
        `Check the exact name of the folder you exported to.`
    );
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    // Alphabetical order = numeric order thanks to the zero padding
    // (name-001.jpg, name-002.jpg, ...). `numeric: true` is an extra safety
    // net for files that were exported without padding.
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((f) => path.join(dir, f));

  if (files.length === 0) {
    throw new Error(
      `[gallery] The folder "src/images/galleries/${folderName}" contains no photos (.jpg/.jpeg/.png).`
    );
  }
  return files;
}

// --- Image processing (eleventy-img + sharp) ---

async function buildPhotoData(filePath, { needsLightbox, alt }) {
  const gridMetadata = await Image(filePath, {
    widths: GRID_WIDTHS,
    formats: ["avif", "webp", "jpeg"],
    outputDir: GALLERY_OUTPUT_DIR,
    urlPath: GALLERY_URL_PATH,
    sharpOptions: { fit: "inside" },
    formatOptions: FORMAT_OPTIONS,
  });

  // "Blur-up" placeholder: a tiny base64 thumbnail, generated with dryRun
  // (nothing is written to disk).
  const blurMetadata = await Image(filePath, {
    widths: [20],
    formats: ["jpeg"],
    dryRun: true,
    sharpOptions: { fit: "inside" },
    formatOptions: { jpeg: { quality: 35 } },
  });
  const blurDataUrl = `data:image/jpeg;base64,${blurMetadata.jpeg[0].buffer.toString("base64")}`;

  const largestGrid = gridMetadata.jpeg[gridMetadata.jpeg.length - 1];
  const aspectRatio = largestGrid.width / largestGrid.height;

  let lightbox = null;
  if (needsLightbox) {
    const lightboxMetadata = await Image(filePath, {
      widths: LIGHTBOX_WIDTHS,
      formats: ["avif", "webp", "jpeg"],
      outputDir: GALLERY_OUTPUT_DIR,
      urlPath: GALLERY_URL_PATH,
      sharpOptions: { fit: "inside" },
      formatOptions: FORMAT_OPTIONS,
    });
    const largestJpeg = lightboxMetadata.jpeg[lightboxMetadata.jpeg.length - 1];
    lightbox = {
      jpeg: largestJpeg,
      webp: lightboxMetadata.webp && lightboxMetadata.webp[lightboxMetadata.webp.length - 1],
      avif: lightboxMetadata.avif && lightboxMetadata.avif[lightboxMetadata.avif.length - 1],
      width: largestJpeg.width,
      height: largestJpeg.height,
    };
  }

  return { grid: gridMetadata, aspectRatio, blurDataUrl, lightbox, alt };
}

// --- Justified rows layout ---

// Returns, for a given breakpoint, an array of rows; each row is an array of
// { item, width } (same order as `items`), grouped with the Flickr algorithm.
// justified-layout computes both the grouping into rows and the width of each
// box. The real width on screen is resolved by CSS (flexbox) from the aspect
// ratio, but the width returned here is a very good approximation, so it is
// used as the `sizes` attribute of each image. Each breakpoint block is only
// downloaded while it is the visible one, so a fixed px `sizes` per block is
// valid.
function computeRows(items, getAspectRatio, breakpoint) {
  const ratios = items.map(getAspectRatio);
  const layout = justifiedLayout(ratios, {
    ...JUSTIFIED_OPTIONS,
    containerWidth: breakpoint.containerWidth,
    targetRowHeight: breakpoint.targetRowHeight,
  });

  const rows = [];
  let currentTop = null;
  let currentRow = null;

  layout.boxes.forEach((box, i) => {
    if (box.top !== currentTop) {
      currentRow = [];
      rows.push(currentRow);
      currentTop = box.top;
    }
    // Math.ceil so rounding never leaves us short (better to request a few
    // px too many than to serve an image slightly too small for its box).
    currentRow.push({ item: items[i], width: Math.ceil(box.width) });
  });

  return rows;
}

// Generates the HTML of the 3 breakpoint blocks; only one is visible at a time
// thanks to the media queries in the GALLERY section of styles.css.
// `renderItem(item, aspectRatio, width, isFirstRow)` must return the HTML of
// one box of the grid; `width` is the px width computed by justified-layout
// for that photo at that breakpoint, ready to use as `sizes`. `isFirstRow`
// marks the photos of the first row: they are always visible on load (above
// the fold at every breakpoint), so they must not use loading="lazy", which
// would delay the Largest Contentful Paint.
function renderJustifiedGrid(items, getAspectRatio, renderItem, wrapperClass) {
  return BREAKPOINTS.map((bp) => {
    const rows = computeRows(items, getAspectRatio, bp);
    const rowsHtml = rows
      .map((row, rowIndex) => {
        const boxesHtml = row
          .map(({ item, width }) => renderItem(item, getAspectRatio(item), width, rowIndex === 0))
          .join("\n");
        return `<div class="gallery-row">${boxesHtml}</div>`;
      })
      .join("\n");
    return `<div class="${wrapperClass} ${wrapperClass}--${bp.key}">${rowsHtml}</div>`;
  }).join("\n");
}

// --- Rendering of a single photo ---

function renderPicture(photo, sizes, priority) {
  const { grid, alt } = photo;
  const sourcesHtml = ["avif", "webp"]
    .filter((fmt) => grid[fmt])
    .map((fmt) => {
      const srcset = grid[fmt].map((entry) => `${entry.url} ${entry.width}w`).join(", ");
      return `<source type="image/${fmt}" srcset="${srcset}" sizes="${sizes}">`;
    })
    .join("\n    ");

  const jpegSrcset = grid.jpeg.map((entry) => `${entry.url} ${entry.width}w`).join(", ");
  const fallback = grid.jpeg[grid.jpeg.length - 1];

  // "priority" = photo in the first row of the grid: requested right away
  // (loading="eager") with high network priority, instead of waiting for the
  // browser to decide it is needed.
  const loadingAttrs = priority
    ? `loading="eager"\n      fetchpriority="high"`
    : `loading="lazy"`;

  return `<picture>
    ${sourcesHtml}
    <img
      class="gallery-img"
      src="${fallback.url}"
      srcset="${jpegSrcset}"
      sizes="${sizes}"
      width="${fallback.width}"
      height="${fallback.height}"
      alt="${alt}"
      ${loadingAttrs}
      decoding="async"
    >
  </picture>`;
}

function renderGalleryItem(photo, aspectRatio, width, isFirstRow) {
  const pictureHtml = renderPicture(photo, `${width}px`, isFirstRow);
  const lb = photo.lightbox;
  const dataAttrs = [
    `data-jpeg="${lb.jpeg.url}"`,
    lb.webp ? `data-webp="${lb.webp.url}"` : "",
    lb.avif ? `data-avif="${lb.avif.url}"` : "",
    `data-pswp-width="${lb.width}"`,
    `data-pswp-height="${lb.height}"`,
  ]
    .filter(Boolean)
    .join(" ");

  return `<a
    class="gallery-item"
    href="${lb.jpeg.url}"
    ${dataAttrs}
    style="flex-grow:${aspectRatio}; background-image:url('${photo.blurDataUrl}');"
  >${pictureHtml}</a>`;
}

function renderSelectedWorkItem(entry, aspectRatio, width, isFirstRow) {
  const pictureHtml = renderPicture(entry.photo, `${width}px`, isFirstRow);
  return `<a
    class="selected-work-item"
    href="${entry.url}"
    style="flex-grow:${aspectRatio}; background-image:url('${entry.photo.blurDataUrl}');"
  >${pictureHtml}</a>`;
}

// --- Shortcodes ---

async function galleryShortcode(folderName, altPrefix = "Photograph") {
  if (!folderName || typeof folderName !== "string") {
    throw new Error('[gallery] Usage: {% gallery "folder-name" %}');
  }

  const files = getGalleryFiles(folderName);
  const photos = await Promise.all(
    files.map((file, i) =>
      buildPhotoData(file, { needsLightbox: true, alt: `${altPrefix} ${i + 1}` })
    )
  );

  const inner = renderJustifiedGrid(photos, (p) => p.aspectRatio, renderGalleryItem, "gallery-rows");

  return `<div class="gallery" data-gallery="${folderName}">${inner}</div>`;
}

async function selectedWorksShortcode(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error(
      '[selectedWorks] Usage: {% selectedWorks [{ gallery: "folder", url: "/path/" }, ...] %}'
    );
  }

  const resolved = await Promise.all(
    entries.map(async (entry) => {
      if (!entry.gallery || !entry.url) {
        throw new Error('[selectedWorks] Each entry needs "gallery" and "url".');
      }
      const files = getGalleryFiles(entry.gallery);
      const coverIndex = entry.cover ? entry.cover - 1 : 0;
      const coverFile = files[coverIndex] || files[0];
      const photo = await buildPhotoData(coverFile, {
        needsLightbox: false,
        alt: entry.alt || `Cover of the ${entry.gallery} gallery`,
      });
      return { photo, url: entry.url };
    })
  );

  const inner = renderJustifiedGrid(
    resolved,
    (entry) => entry.photo.aspectRatio,
    renderSelectedWorkItem,
    "gallery-rows"
  );

  return `<div class="selected-works" data-selected-works>${inner}</div>`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode("gallery", galleryShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("selectedWorks", selectedWorksShortcode);

  // PhotoSwipe is self-hosted: the already-built files are copied from
  // node_modules (no CDN, like the fonts).
  eleventyConfig.addPassthroughCopy({
    "node_modules/photoswipe/dist/photoswipe.esm.min.js": "js/vendor/photoswipe/photoswipe.esm.min.js",
    "node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js":
      "js/vendor/photoswipe/photoswipe-lightbox.esm.min.js",
    "node_modules/photoswipe/dist/photoswipe.css": "js/vendor/photoswipe/photoswipe.css",
    // PhotoSwipe's MIT license travels with its files in the published site.
    "node_modules/photoswipe/LICENSE": "js/vendor/photoswipe/LICENSE",
  });

  eleventyConfig.addPassthroughCopy({ "src/js/gallery.js": "js/gallery.js" });
};
