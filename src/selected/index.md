---
layout: gallery.njk
permalink: /selected/
title: Selected
description: A curated index of galleries.
---
# Selected

Each cover links to its own page. Use `selectedWorks` when you want a curated
index instead of listing every photo.

{% selectedWorks [
  { gallery: "example-gallery", url: "/", alt: "Cover of the Work gallery" },
  { gallery: "example-series", url: "/series/", cover: 3, alt: "Cover of the Series gallery" }
] %}
