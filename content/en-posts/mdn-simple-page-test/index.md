---
title: Creating a Simple Page Test with MDN
date: "2023-03-23T01:00:00Z"
description: "MDN HTML, Multimedia and Embedding"
tags: ["web", "study", "front", "HTML"]
---

# Creating a Simple Page Test

[MDN provides an example of embedding media in a simple page.](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Mozilla_splash_page) Let's give it a try.

First, download the evaluation files from [github](https://github.com/mdn/learning-area/tree/main/html/multimedia-and-embedding/mdn-splash-page-start). After downloading index.html, place pattern.png in the same folder and also download the images from the originals folder.

For now, disregard the CSS in index.html. The basic structure of the body tag in the provided index.html is as follows.

```html
<body>
  <header>
    <h1>Mozilla</h1>
    <!-- insert <img> element, link to the small
        version of the Firefox logo -->
  </header>

  <main>
    <article>
      <!-- insert iframe from youtube -->

      <h2>Rocking the free web</h2>

      <p>
        Mozilla are a global community of technologists, thinkers, and
        builders, working together to keep the Internet alive and accessible,
        so people worldwide can be informed contributors and creators of the
        Web. We believe this act of human collaboration across an open
        platform is essential to individual growth and our collective future.
      </p>

      <p>
        Click on the images below to find more information about the cool
        stuff Mozilla does.
        <a href="https://www.flickr.com/photos/mathiasappel/21675551065/"
          >Red panda picture</a
        >
        by Mathias Appel.
      </p>
    </article>

    <div class="further-info">
      <!-- insert images with srcsets and sizes -->
      <a href="https://www.mozilla.org/en-US/firefox/new/">
        <img />
      </a>
      <a href="https://www.mozilla.org/">
        <img />
      </a>
      <a href="https://addons.mozilla.org/">
        <img />
      </a>
      <a href="https://developer.mozilla.org/en-US/">
        <img />
      </a>
      <div class="clearfix"></div>
    </div>

    <div class="red-panda">
      <!-- insert picture element -->
    </div>
  </main>
</body>
```

Now, let's proceed step by step as indicated in the comments.

First, add the small Firefox logo image to the header.

```html
<header>
  <h1>Mozilla</h1>
  <!-- insert <img> element, link to the small
      version of the Firefox logo -->
  <img
    src="./firefox_logo-only_RGB.png"
    alt="small version of the Firefox logo"
  />
</header>
```

Next, embed the [YouTube video](https://www.youtube.com/watch?v=ojcNcvb1olg) as an iframe in the main article. Go to the video, click the share button, and choose the embed option to copy the iframe code.

![iframe](./youtube-iframe.png)

Since the YouTube video must be 400px wide, set the iframe width to 400.

```html
<!-- insert iframe from youtube -->
<iframe
  width="400"
  height="315"
  src="https://www.youtube.com/embed/ojcNcvb1olg"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>
```

Then, add the images for the links. The img tag has already been declared, and you need to set the src, alt, srcset, and sizes attributes.

Use a 120px wide image when the screen is less than or equal to 500px, and a 400px wide image otherwise. Set the linked images as follows, ensuring the actual size of the image matches the size indicated in srcset for proper browser rendering.

```html
<img
  srcset="./firefox_logo-only_RGB.png 1200w"
  sizes="(max-width:500px) 120px, 400px"
  src="./firefox_logo-only_RGB.png"
/>
```

Now, let's use the picture tag to insert the red panda image. Use the small panda image when the viewport is less than or equal to 600px, and the large panda image otherwise. The red-panda-small.jpg should be appropriately cropped from an existing image.

```html
<div class="red-panda">
  <!-- insert picture element -->
  <picture>
    <source media="(max-width:600px)" srcset="./red-panda-small.jpg" />
    <img src="./red-panda.jpg" alt="Red panda" />
  </picture>
</div>
```

This way, you can check that different images are displayed depending on the screen width. Following these steps will enable you to complete the evaluation criteria set by MDN.