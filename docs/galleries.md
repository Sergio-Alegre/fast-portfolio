# Galleries

Every subfolder of `src/images/galleries/` is a gallery you can place in any
page with:

```
{% gallery "folder-name" %}
```

The page needs `layout: gallery.njk` in its header to get the wide container
(the `base.njk` layout is a narrow column of text).

## Exporting from Lightroom

1. Set the final order of the photos in Lightroom (drag them in the filmstrip or
   the grid view). The gallery follows the order of the file names.
2. Export to `src/images/galleries/folder-name/`:
   - Format JPEG, color space sRGB, quality 80-90.
   - Resize to fit **Long Edge**, **at least 2600 px**. The lightbox shows this
     size; the grid uses smaller versions the build generates for you.
   - Rename with **Custom Name - Sequence**: custom name `folder-name`, start
     number `001`. Lightroom keeps the zero padding when the start number has
     leading zeros.
3. The result should be:

   ```
   folder-name-001.jpg
   folder-name-002.jpg
   ...
   folder-name-042.jpg
   ```

   The padding matters: file names are sorted alphabetically (with a numeric
   safety net), and without it `10.jpg` would come before `2.jpg`.
4. Run `npm run build` (or just `npm start` while writing).

PNG files are accepted too. Photos smaller than a generated width are never
enlarged, so small sources simply produce fewer sizes.

## Updating a gallery

Add, remove or replace photos in the folder and build again. No page and no
template needs to change.

## Shortcodes

### `gallery`

```
{% gallery "folder-name" %}
{% gallery "folder-name", "Alt text prefix" %}
```

The second form sets the alt text of the photos to "Alt text prefix 1",
"Alt text prefix 2"... The default prefix is "Photograph". For good
accessibility, use a short description of the series, such as "Portrait of a
dancer".

### `selectedWorks`

A curated index: one cover per entry, each linking to a page, instead of
listing every photo.

```
{% selectedWorks [
  { gallery: "folder-name", url: "/destination/" },
  { gallery: "other-folder", url: "/other/", cover: 3, alt: "Cover of the other gallery" }
] %}
```

`cover` is optional: the number of the photo (starting at 1) used as the cover.
By default the first photo is used. `alt` is optional too.

### `image`

A single image with AVIF, WebP and JPEG versions at several sizes:

```
{% image "src/images/portrait.jpg", "Describe the photo", "(max-width: 600px) 100vw, 696px" %}
```

The third argument is the `sizes` attribute and is optional.

### `youtube`

```
{% youtube "VIDEO_ID" %}
{% youtube "VIDEO_ID", 40 %}
```

The second form starts the video at second 40. It embeds the cookie-less
`youtube-nocookie.com` domain.

## How the rows are built

The photos of a gallery are grouped into rows by
[justified-layout](https://github.com/flickr/justified-layout), once for each of
three breakpoints (mobile, tablet, desktop). All three blocks are in the HTML,
but only the one that matches the window width is displayed, and browsers do not
download the images of hidden blocks. Inside a row, each photo is a flex item
whose `flex-grow` is its own aspect ratio, which gives every photo in the row
the same height without cropping any of them.

The first row is loaded eagerly with high priority (it is always visible), the
rest lazily. A tiny blurred copy of each photo shows until the sharp image has
loaded and fades in.
