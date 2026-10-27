// Client script for the galleries: fade-in of the blur-up placeholder and
// lightbox (PhotoSwipe) with format selection (AVIF > WebP > JPEG).
// Served as a native ES module, with no bundler (see gallery.njk).

import PhotoSwipeLightbox from "/js/vendor/photoswipe/photoswipe-lightbox.esm.min.js";

// Minimal test images (1-2px) to detect real browser support, instead of
// relying on user-agent sniffing.
const AVIF_TEST_SRC =
  "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=";
const WEBP_TEST_SRC =
  "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";

function canDecode(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function pickBestFormat() {
  if (await canDecode(AVIF_TEST_SRC)) return "avif";
  if (await canDecode(WEBP_TEST_SRC)) return "webp";
  return "jpeg";
}

function fadeInLoadedImages() {
  document.querySelectorAll(".gallery-img").forEach((img) => {
    if (img.complete) {
      img.classList.add("is-loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    }
  });
}

// PhotoSwipe's CSS is only needed when the lightbox opens, not to paint the
// gallery grid. Loading it here (instead of with a synchronous <link> in the
// <head>) keeps it from blocking the initial render of the page.
function loadPhotoSwipeCSS() {
  if (document.querySelector('link[data-photoswipe-css]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/js/vendor/photoswipe/photoswipe.css";
  link.dataset.photoswipeCss = "true";
  document.head.appendChild(link);
}

async function initGalleryLightbox() {
  const items = document.querySelectorAll("a.gallery-item");
  if (items.length === 0) return;

  loadPhotoSwipeCSS();
  const format = await pickBestFormat();
  items.forEach((item) => {
    const url = item.dataset[format] || item.dataset.jpeg;
    if (url) item.setAttribute("href", url);
  });

  const lightbox = new PhotoSwipeLightbox({
    gallery: ".gallery-rows",
    children: "a.gallery-item",
    pswpModule: () => import("/js/vendor/photoswipe/photoswipe.esm.min.js"),
    preload: [1, 1],
    bgOpacity: 0.95,
    padding: { top: 20, bottom: 20, left: 20, right: 20 },
  });
  lightbox.init();
}

fadeInLoadedImages();
initGalleryLightbox();
