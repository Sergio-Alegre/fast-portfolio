"use strict";

/**
 * Curriculum sections (/cv/).
 *
 * Usage in src/cv/index.md (one entry per line, "label | text"):
 *
 *   {% cvsection "Education" %}
 *   2016–2019 | Bachelor of Arts in Photography, Example University (City).
 *   2014–2016 | Course in Documentary Photography, Example School.
 *   {% endcvsection %}
 *
 * - A line that starts with spaces continues the previous entry, so long
 *   entries can be split over several lines of the file.
 * - If NO entry has " | ", the section is drawn without the label column (a
 *   list of paragraphs). The two forms cannot be mixed in one section.
 * - HTML in the text is escaped, and Markdown-style links, [text](url), are
 *   supported. Absolute links (http/https) open in a new tab.
 *
 * It outputs <section><h2>…</h2><ul class="cv-list">…</ul></section> with no
 * blank lines (so Markdown treats it as a single HTML block). The styles are
 * in the CURRICULUM sections of src/css/styles.css. See docs/cv.md.
 */

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text) {
  return escapeHtml(text).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    const external = /^https?:\/\//.test(url);
    const attrs = external ? ' target="_blank" rel="noopener"' : "";
    return `<a href="${url}"${attrs}>${label}</a>`;
  });
}

function parseEntries(content) {
  const entries = [];
  for (const line of content.split("\n")) {
    if (!line.trim()) continue;
    if (/^\s/.test(line) && entries.length) {
      entries[entries.length - 1] += " " + line.trim();
    } else {
      entries.push(line.trim());
    }
  }
  return entries;
}

function cvSectionShortcode(content, title) {
  const entries = parseEntries(content);
  const labelled = entries.map((entry) => entry.includes(" | "));
  const withLabels = labelled.filter(Boolean).length;

  if (withLabels !== 0 && withLabels !== entries.length) {
    throw new Error(
      `cvsection "${title}": some entries have " | " and some do not; use a single form in each section.`
    );
  }

  const items = entries.map((entry) => {
    if (!withLabels) return `<li><span>${inline(entry)}</span></li>`;
    const sep = entry.indexOf(" | ");
    const label = entry.slice(0, sep).trim();
    const text = entry.slice(sep + 3).trim();
    return `<li><span class="cv-label">${escapeHtml(label)}</span><span>${inline(text)}</span></li>`;
  });

  const listClass = withLabels ? "cv-list" : "cv-list cv-list--plain";
  return [
    "<section>",
    `<h2>${escapeHtml(title)}</h2>`,
    `<ul class="${listClass}">`,
    ...items,
    "</ul>",
    "</section>",
  ].join("\n");
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPairedShortcode("cvsection", cvSectionShortcode);
};
