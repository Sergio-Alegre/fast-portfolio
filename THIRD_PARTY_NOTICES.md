# Third-party notices

Fast Portfolio is released under the [MIT License](LICENSE). It is built on
the open-source projects below. Their licenses apply to them, not to this
project, and their copyright notices must be kept.

This file covers software, fonts and icons. Photographs and text that may ship
with a copy of the template have their own terms, listed separately where they
apply.

## 1. Included in the published website

These files are copied into the generated site and delivered to visitors'
browsers, so their license text is included with them.

### Jost

The typeface used for all text, self-hosted as WOFF2 files (Light and Regular)
in `src/css/fonts/Jost/`. It is served from your own domain, so visitors'
browsers do not contact any third-party font service.

- Copyright 2020 The Jost Project Authors (<https://github.com/indestructible-type>)
- License: SIL Open Font License 1.1. The full text is in
  [`src/css/fonts/Jost/OFL.txt`](src/css/fonts/Jost/OFL.txt) and must stay next
  to the font files wherever they are copied or redistributed.
- Also distributed through Google Fonts (<https://fonts.google.com/specimen/Jost>).
- The copyright notice declares no Reserved Font Name. The OFL allows bundling
  and commercial use, but forbids selling the font on its own.

If you replace Jost with another typeface, replace this entry with that
typeface's copyright line and license.

### Placeholder logo

`src/images/icons/logo.svg` is a placeholder. Its letters are outlines of the
Anton typeface (Copyright 2020 The Anton Project Authors,
<https://github.com/googlefonts/AntonFont.git>, SIL Open Font License 1.1).
The OFL allows using a font to create artwork, so the SVG carries no font and no
extra conditions. Replace it with your own logo.

### Social icons

The icons shown in the footer, in `src/images/social/`.

**Simple Icons 16.36.0** (<https://simpleicons.org>): `github.svg`,
`instagram.svg`, `telegram.svg`, `whatsapp.svg` and `youtube.svg`.

- License: CC0 1.0 Universal (public domain dedication). No attribution is
  required.
- The brand logos are trademarks of their respective owners. They are included
  only so that visitors can recognise a link to your profile on that service,
  and they do not imply any endorsement. Check each brand's guidelines if you
  use them in another way.

**Lucide 0.469.0** (<https://lucide.dev>): `mail.svg`.

- License: ISC. The notice below must be kept with the icon.

```
ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

If you add icons from another source, list them here with their license.

### PhotoSwipe 5.4.4

The lightbox that opens when a gallery photo is clicked. Its full license text
is reproduced below. Copied from
`node_modules/photoswipe/dist/` to `js/vendor/photoswipe/` at build time.

- Project: <https://photoswipe.com> ([source](https://github.com/dimsemenov/PhotoSwipe))
- License: MIT

```
The MIT License (MIT)

Copyright (c) 2014-2022 Dmitry Semenov, https://dimsemenov.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## 2. Build-time dependencies

These are installed with `npm install` and run only while the site is being
built. They are not copied into this repository or into the published site;
each one ships with its own license text inside its npm package.

| Package | Version | License | Used for | Copyright |
|---|---|---|---|---|
| [@11ty/eleventy](https://www.11ty.dev) | 3.1.6 | MIT | Static site generator | (c) 2017–2024 Zach Leatherman |
| [@11ty/eleventy-img](https://github.com/11ty/eleventy-img) | 6.0.4 | MIT | Generates AVIF, WebP and JPEG variants of every image | Zach Leatherman |
| [@11ty/eleventy-utils](https://github.com/11ty/eleventy-utils) | 2.0.7 | MIT | Helpers used by Eleventy | (c) 2022–2024 Zach Leatherman |
| [justified-layout](https://github.com/flickr/justified-layout) | 4.1.0 | ISC | Computes the justified rows of the gallery without cropping | Copyright 2019 SmugMug, Inc. |
| [sharp](https://sharp.pixelplumbing.com) | 0.34.5 | Apache-2.0 | Image processing engine used by eleventy-img | Lovell Fuller and contributors |

`sharp` downloads prebuilt binaries of libvips for your platform, which are
licensed under LGPL-3.0-or-later. They are installed by npm and are not
redistributed by this project.

### Development tools

Only used while developing, never part of the published site:
[chokidar](https://github.com/paulmillr/chokidar) (MIT, Paul Miller and Elan
Shanker), [concurrently](https://github.com/open-cli-tools/concurrently) (MIT,
Kimmo Brunfeldt) and [nodemon](https://nodemon.io) (MIT, Remy Sharp).

## Versions

Versions are the ones this project was built and tested with. To list the
license of every package in your own installation, run
`npx license-checker --summary`.
