---
title: About Favicon
date: "2023-06-16T00:00:00Z"
description: "How can we set a favicon?"
tags: ["front", "tip"]
---

# 1. Favicon

A favicon is a small image used to represent a web page. It serves as an image that displays the site when added to bookmarks or as a small image next to the site title when the page is opened in a tab.

# 2. How to Set

You can set it by adding a `<link>` tag within the `<head>` tag.

```html
<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
```

However, using a single SVG image for all icons is not advisable. While it may be technically feasible, it is not optimal from a UI/UX perspective.

On iOS, all home screen icons are rounded square shapes. In contrast, Android may have icons that are not necessarily square, reflecting differences across platforms. Therefore, it is recommended to use different icons for each platform.

## 2.1. iOS Safari

Safari uses the touch icon as a favicon, typically utilizing a 180x180 PNG file. Transparency should not be used.

```html
<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
```

This is commonly used as the default high-resolution icon in many browsers, appearing in places such as bookmark additions.

## 2.2. Android Chrome

Chrome employs the Web App Manifest, which, while not exclusive to Chrome, is primarily supported by it.

A 192x192 PNG file can be used, and transparency is permissible (and even recommended).

```html
<link rel='manifest' href='/site.webmanifest' />
```

## 2.3. Internet Explorer

The `browserconfig.xml` file is utilized. A 32x32 PNG file is used, and a background color must also be specified.

```html
<meta name='msapplication-TileColor' content='#ffffff' />
<meta name="msapplication-config" content="/browserconfig.xml">
```

## 2.4. General Browsers

Using the `favicon.ico` file to declare a favicon is a traditional method. However, most modern browsers support the use of lighter PNG files, and may not even fully support ICO files.

Therefore, you can declare all of these formats and let the browser choose which to use.

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="shortcut icon" href="/favicon.ico">
```

Opera, for instance, uses a 228x228 PNG file among several other browser standards. However, since the aforementioned method is sufficiently supported, there is no need to create specialized icons.

You can generate favicons from images or check if your page's favicon is set correctly at [realfavicongenerator.net](https://realfavicongenerator.net/).

# References

https://stackoverflow.com/questions/48956465/favicon-standard-2023-svg-ico-png-and-dimensions