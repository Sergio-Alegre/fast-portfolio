---
layout: base.njk
permalink: /about/
title: About
description: About the photographer.
---
# About

Write a few lines about who you are and what you photograph. This page uses
the `base.njk` layout: a narrow column of text, good for reading.

You can add a portrait with the `image` shortcode, which generates AVIF, WebP
and JPEG versions at several sizes:

```
{% raw %}{% image "src/images/portrait.jpg", "Describe the photo", "(max-width: 600px) 100vw, 696px" %}{% endraw %}
```

And embed a video, hosted on the cookie-less YouTube domain:

```
{% raw %}{% youtube "VIDEO_ID" %}{% endraw %}
```
