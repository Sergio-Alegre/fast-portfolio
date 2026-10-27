// Site-wide settings. This is the one file to edit to make the template yours:
// every layout, the footer, the sitemap and the web manifest read from here.

module.exports = {
  // Your name or studio. Shown in the header and the footer copyright.
  name: "Your Name",

  // Suffix of the <title> of every page: "Page title · Your Name Photography".
  // A page can replace the whole title with `seoTitle` in its front matter.
  title: "Your Name Photography",

  // Used as the default <meta name="description">.
  description: "Portfolio of Your Name, photographer based in Your City.",

  // Final address of the site, WITHOUT a trailing slash. Used for canonical
  // URLs, the sitemap and robots.txt.
  url: "https://example.com",

  // Language of the pages (the lang attribute of <html>).
  language: "en",

  // Header: a text wordmark by default. To use an image instead, put it in
  // src/images/ and set its path, e.g. "/images/logo.svg" (shown at 30-48px
  // tall).
  logo: null,

  // Main menu, in order.
  nav: [
    { label: "Work", url: "/" },
    { label: "Series", url: "/series/" },
    { label: "Selected", url: "/selected/" },
    { label: "About", url: "/about/" },
    { label: "Contact", url: "/contact/" }
  ],

  // Footer links on the right, shown as icons. `icon` is the name of a file in
  // src/images/social/ without the extension: instagram, youtube, github,
  // telegram, whatsapp and mail are included. Without an `icon`, the label is
  // shown as a text link. `label` is also the accessible name of the icon.
  // Add your own icons to that folder (SVG, ideally 24x24) and keep their
  // licenses in THIRD_PARTY_NOTICES.md.
  social: [
    { label: "Instagram", url: "https://www.instagram.com/", icon: "instagram" },
    { label: "YouTube", url: "https://www.youtube.com/", icon: "youtube" },
    { label: "GitHub", url: "https://github.com/", icon: "github" },
    { label: "Email", url: "mailto:you@example.com", icon: "mail" },
    { label: "WhatsApp", url: "https://wa.me/", icon: "whatsapp" },
    { label: "Telegram", url: "https://t.me/", icon: "telegram" }
  ],

  // Footer links to your legal pages (privacy policy, imprint...). Remove the
  // ones you do not need. The pages themselves live in src/.
  legal: [
    { label: "Privacy", url: "/privacy/" }
  ],

  // Holder of the copyright notice in the footer ("© 2026 Your Name").
  copyrightHolder: "Your Name",

  // Optional, privacy-friendly analytics. Leave `url` empty to include no
  // tracking code at all.
  analytics: {
    matomo: {
      url: "",    // e.g. "//analytics.example.com/"
      siteId: 1
    }
  }
};
