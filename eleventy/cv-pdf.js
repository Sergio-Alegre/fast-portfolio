"use strict";

/**
 * PDF of the curriculum (/curriculum.pdf), generated at build time.
 *
 * It prints the already built page /cv/ (dist/cv/index.html) with a headless
 * Chrome, Edge or Chromium, so the PDF has exactly the look of the website. The
 * paper size (A4) and the print settings are in the CURRICULUM - PRINT section
 * of src/css/styles.css. See docs/cv.md.
 *
 * THIS IS NODE.JS, NOT A SHELL SCRIPT: the same file works on Windows, macOS and
 * Linux. It is switched off by default (see the commented lines in
 * .eleventy.js), so a normal build needs no browser at all.
 *
 * - It is only regenerated when something that affects the result changes (the
 *   page HTML, the CSS, the images and fonts it uses, and this file). The
 *   generated PDF is kept in .cache/ so it survives "npm run rebuild" (which
 *   deletes dist/) without needing the browser.
 * - If it has to be generated and no browser is found, the build fails instead
 *   of carrying on without a PDF: a deploy would delete /curriculum.pdf from
 *   the server.
 *
 * Which browser it uses:
 *   1. The CV_PDF_BROWSER environment variable, if set. Examples:
 *
 *        Windows (PowerShell):
 *          $env:CV_PDF_BROWSER = "C:\Program Files\Google\Chrome\Application\chrome.exe"
 *          npm run build
 *
 *        macOS (Terminal):
 *          CV_PDF_BROWSER="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run build
 *
 *        Linux (bash):
 *          CV_PDF_BROWSER=/usr/bin/chromium npm run build
 *
 *   2. Otherwise, the first of these that exists (see browserCandidates()):
 *        Windows: Chrome or Edge in Program Files, Program Files (x86) or
 *                 %LocalAppData%
 *        macOS:   Google Chrome or Microsoft Edge in /Applications
 *        Linux:   google-chrome, chromium, chromium-browser or microsoft-edge
 *                 in /usr/bin
 *
 * Linux in a container or as root (for example in CI): Chrome refuses to start
 * without "--no-sandbox". Add that flag to the list in renderPdf() below, but
 * only in an environment you trust.
 */

const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");

// The final address of the site (src/_data/site.js): internal links of the page
// become absolute in the PDF, so they work when the PDF is opened elsewhere.
const SITE_URL = require("../src/_data/site.js").url;

const PAGE_URL = "/cv/";
const OUTPUT_NAME = "curriculum.pdf";
const CACHE_DIR = path.resolve(".cache");
const CACHED_PDF = path.join(CACHE_DIR, OUTPUT_NAME);
const CACHED_HASH = path.join(CACHE_DIR, "curriculum.pdf.hash");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};

function browserCandidates() {
  const env = process.env;
  if (env.CV_PDF_BROWSER) return [env.CV_PDF_BROWSER];

  // Windows
  if (process.platform === "win32") {
    const roots = [env["ProgramFiles"], env["ProgramFiles(x86)"], env["LocalAppData"]].filter(Boolean);
    const rel = [
      "Google\\Chrome\\Application\\chrome.exe",
      "Microsoft\\Edge\\Application\\msedge.exe",
    ];
    return roots.flatMap((root) => rel.map((r) => path.join(root, r)));
  }

  // macOS
  if (process.platform === "darwin") {
    return [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ];
  }

  // Linux and others
  return [
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
  ];
}

function findBrowser() {
  const found = browserCandidates().find((p) => fs.existsSync(p));
  if (!found) {
    throw new Error(
      "cv-pdf: Chrome, Edge or Chromium not found, needed to generate /curriculum.pdf. " +
        "Install one, or give its path in the CV_PDF_BROWSER environment variable (see docs/cv.md)."
    );
  }
  return found;
}

// The version URLs (?v=<build time>) change on every build: they do not count.
function normalize(text) {
  return text.replace(/\?v=\d+/g, "");
}

// Hash of everything that affects the PDF: the page, the CSS, the local files
// they reference (images, fonts) and this module.
function computeHash(outDir, html, css) {
  const hash = crypto.createHash("sha256");
  hash.update(normalize(html));
  hash.update(normalize(css));
  hash.update(fs.readFileSync(__filename));
  const refs = new Set();
  const re = /\/[^\s"'(),]+\.(?:png|jpe?g|webp|avif|svg|woff2?|ttf)/gi;
  for (const text of [html, css]) {
    for (const m of text.matchAll(re)) refs.add(m[0]);
  }
  for (const ref of [...refs].sort()) {
    const file = path.join(outDir, ref);
    hash.update(ref);
    if (fs.existsSync(file)) hash.update(fs.readFileSync(file));
  }
  return hash.digest("hex");
}

// Serves only dist/ (paths are resolved inside outDir). The CV page is adapted
// for the render: no analytics (printing must not count as a visit) and
// absolute internal links, so in the PDF they point to the real site and not to
// 127.0.0.1.
function startServer(outDir) {
  const root = path.resolve(outDir);
  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    const file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
    if (pathname === PAGE_URL + "index.html") {
      const html = fs
        .readFileSync(file, "utf8")
        .replace(/<script>\s*var _paq[\s\S]*?<\/script>/, "")
        .replace(/(<a\s[^>]*?href=")\/(?!\/)/g, `$1${SITE_URL}/`);
      res.writeHead(200, { "Content-Type": type }).end(html);
      return;
    }
    res.writeHead(200, { "Content-Type": type }).end(fs.readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

// Edge (msedge.exe) can exit with code 0 before it has written the PDF: a child
// process writes it a moment later. So checking for the file right after the
// browser exits is not enough: wait for it to appear and for its size to stop
// changing.
async function waitForPdf(file, timeoutMs = 30000) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const deadline = Date.now() + timeoutMs;
  let lastSize = -1;
  while (Date.now() < deadline) {
    const size = fs.existsSync(file) ? fs.statSync(file).size : 0;
    if (size > 0 && size === lastSize) return true;
    lastSize = size;
    await sleep(300);
  }
  return false;
}

async function renderPdf(outDir, target) {
  const browser = findBrowser();
  const server = await startServer(outDir);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cv-pdf-"));
  const tmpPdf = path.join(profile, OUTPUT_NAME);
  try {
    const url = `http://127.0.0.1:${server.address().port}${PAGE_URL}`;
    await new Promise((resolve, reject) => {
      execFile(
        browser,
        [
          "--headless",
          "--disable-gpu",
          "--no-first-run",
          `--user-data-dir=${profile}`,
          "--no-pdf-header-footer",
          `--print-to-pdf=${tmpPdf}`,
          // "--no-sandbox",   // Linux as root or in a container only; see the note above
          url,
        ],
        { timeout: 60000 },
        (err) => (err ? reject(err) : resolve())
      );
    });
    if (!(await waitForPdf(tmpPdf))) {
      throw new Error("cv-pdf: the browser did not produce the PDF.");
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(tmpPdf, target);
  } finally {
    server.close();
    // Edge may take a moment to release the profile folder; if it cannot be
    // deleted, it stays in the system temp folder (not an error).
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
    } catch (err) {
      // ignored on purpose
    }
  }
}

async function buildCvPdf(outDir) {
  const pageFile = path.join(outDir, "cv", "index.html");
  const cssFile = path.join(outDir, "css", "styles.css");
  if (!fs.existsSync(pageFile) || !fs.existsSync(cssFile)) return;

  const hash = computeHash(outDir, fs.readFileSync(pageFile, "utf8"), fs.readFileSync(cssFile, "utf8"));
  const upToDate =
    fs.existsSync(CACHED_PDF) && fs.existsSync(CACHED_HASH) && fs.readFileSync(CACHED_HASH, "utf8") === hash;

  if (!upToDate) {
    await renderPdf(outDir, CACHED_PDF);
    fs.writeFileSync(CACHED_HASH, hash);
    console.log(`[cv-pdf] ${OUTPUT_NAME} generated`);
  }
  fs.copyFileSync(CACHED_PDF, path.join(outDir, OUTPUT_NAME));
}

module.exports = function registerCvPdf(eleventyConfig) {
  eleventyConfig.on("eleventy.after", ({ dir }) => buildCvPdf(dir.output));
};
