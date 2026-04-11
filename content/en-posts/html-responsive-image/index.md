---
title: Using Responsive Images in HTML
date: "2023-06-29T03:00:00Z"
description: "Responsive images can also be loaded using HTML."
tags: ["web", "front", "HTML"]
---

# 1. Responsive Images with the img Tag

The img tag in HTML is used to insert images. If you use only the most essential attributes, it would look as follows:

```html
<img src="assets/profile.png" alt="Blog Profile Picture" />
```

However, there may be situations where you want to instruct the browser to display different images depending on the screen size due to memory savings and differences in the emphasized portions based on screen dimensions. This is called responsive images.

Certainly, you could achieve this using CSS. For instance, you could change the image display to a div container and update the `background-image` based on the screen width.

```css
@media screen and (max-width: 600px) {
  .profile {
    background-image: url("assets/profile-small.png");
  }
}

@media screen and (min-width: 600px) {
  .profile {
    background-image: url("assets/profile-large.png");
  }
}
```

Nonetheless, you can also implement this behavior with HTML. One advantage is that it reduces page loading time since the browser loads HTML before interpreting CSS and JS.

If responsive images were implemented using CSS or JS, then it wouldn't be possible to load different images from the start based on screen size. The main parser applies an optimization technique that downloads images before loading and interpreting CSS and JS.

Therefore, CSS and JS are not available at the time of image loading, meaning the browser will display the pre-loaded image and replace it once CSS and JS are loaded.

This extends the time required to load images. Thus, to load different images based on screen size, you need to use HTML. So how can we incorporate responsive images using HTML?

# 2. The img Tag

One method is to use the new attributes `srcset` and `sizes`. The file names specified in the `srcset` attribute must only consist of image format files supported by the browser.

The most representative example is as follows.

```html
<img
  srcset="image-320w.jpg 320w, 
          image-480w.jpg 480w, 
          image-768w.jpg 768w"
  sizes="(max-width:320px) 280px,
        (max-width:480px) 440px,
        800px"
  src="image.jpg"
  alt="Default Image"
/>
```

However, since there are many diverse methods, let’s explore them one by one.

## 2.1. Image Selection by Resolution

If your images need to display fixed sizes while supporting various resolutions, you can use descriptors like `2x` without the `sizes` attribute, allowing the browser to select the appropriate resolution image.

Such values like `2x` are referred to as display density descriptors. They instruct the browser to check the device's pixel density when loading images and select accordingly.

```html
<img
  srcset="image-320w.jpg, 
          image-480w.jpg 1.5x, 
          image-768w.jpg 2x"
  src="image.jpg"
  alt="Default Image"
/>
```

The browser will determine the visible resolution and provide the most suitable image from the srcset.

However, this solution may encounter issues when dynamic-sized images are in use. The reason for the caveat "if you need fixed-size images" is that when supporting numerous resolutions, would you need to place images ranging from `1x` to `16x` into the srcset?

What if the resolution dramatically changes as the browser window expands? A problem could arise regarding how many images are loaded.

Alternatively, as seen with the downsampling issue on [iPhone 6 Plus](https://www.paintcodeapp.com/news/iphone-6-screens-demystified), the browser could deliver `1x` images even when `2x` images are available.

Thus, the method of allowing the browser to select images through display density descriptors is recommended in cases of fixed-width images.

## 2.2. Width Descriptor

Then what should be done when using dynamic-sized images? In this case, `width descriptor` and `sizes` should be employed. This indicates the inherent pixel width of the images. This is how the example code above can be interpreted.

```html
<img
  srcset="image-320w.jpg 320w, 
          image-480w.jpg 480w, 
          image-768w.jpg 768w"
  sizes="(max-width:320px) 280px,
        (max-width:480px) 440px,
        800px"
  src="image.jpg"
  alt="Default Image"
/>
```

The srcset defines a list of images and their sizes. The image file names/paths and the inherent pixel width of the images are noted, separated by a space. The inherent pixel width refers to the actual dimension width of the image.

This informs the browser of the actual size of the image. For instance, on a Mac, you can check the image specifications in the file information, where it reveals the width.

If the inherent pixel width is defined as 320w as shown above, it signifies the actual dimension width of the image is 320px.

In the sizes attribute, media queries are defined, indicating how much width the image will occupy according to those media queries. In the above example, the first value states that when the screen is a maximum of 320px, the image will fill 280px.

### 2.2.1. Purpose of Sizes

But why do we need to define how much width the image will occupy through the sizes attribute? Since we already informed the browser of the image's actual width using the width descriptor in the srcset, shouldn't it be able to select and load the appropriate image automatically?

There is a clue in the discussion about the advantages of providing responsive images with HTML.

```
The main parser applies an optimization technique that downloads images before loading and interpreting CSS and JS.
```

When loading a page, the browser first downloads the HTML. It then requests CSS and JS, beginning to load images before the CSS and JS loading has completed.

Thus, at the time the image starts downloading, the browser does not yet have information about the layout of the page. In cases of CSR, it may even begin downloading images without knowing the HTML structure.

At this point, the browser can only know the viewport width. However, this may have little correlation to how wide the image will appear. For instance, on my blog, there are project images that occupy a very small part compared to the viewport width. Even with a much larger viewport width, it may still render an image width of about 210px.

![Project Section of My Blog](./my-blog-project.png)

Therefore, we inform the browser through the sizes attribute about how large the image will approximately appear according to the viewport width.

```html
  sizes="(max-width:320px) 280px,
        (max-width:480px) 440px,
        800px"
```

At this point, the image widths specified in sizes should be expressed in absolute values such as px, em, or viewport width units (vw). Percentages cannot be used.

In the example, when the viewport width is less than or equal to 320px, the image will fill a width of 280px; when it is greater than 320px but less than or equal to 480px, it will fill a width of 440px; and when it exceeds 480px, it will fill a width of 800px.

## 2.3. Browser Handling

With these attributes present, the browser, when loading images, checks the viewport width and evaluates the media conditions, confirming the width contained in the conditions. It then finds and loads the most suitable image from srcset.

This feature is supported only in modern browsers. For older browsers that do not support srcset and sizes, the src attribute can be included.

# 3. Art Direction Issues and Picture

However, there are cases where a different form of image must be shown to convey the essence of the image according to the screen size. For example, when a larger photo of a person would be preferable as the screen size shrinks. This issue is referred to as the art direction problem.

To address this, the picture tag can be used. The picture element wraps multiple sources, allowing the browser to select from the available sources. The picture tag contains source tags as children, and an img tag as the final child.

To provide different images according to various screen sizes, use the picture tag.

```html
<picture>
  <source media="(max-width:768px)" srcset="img-480w.jpg">
  <source media="(max-width:1080px)" srcset="img-720w.jpg">
  <img src="img.jpg" alt="Demo Image">
</picture>
```

The source tag has media conditions that can be configured to show different images based on specific criteria.

The browser checks source tags from top to bottom and displays the image corresponding to the srcset path of the first source tag that meets the conditions.

## 3.1. Media Attribute as a Requirement, Not Suggestion

It is advisable to avoid using the media attribute unless art direction is required.

Using the media attribute enforces the browser to utilize the source tag with media queries that correspond to the current browser state. This disallows the browser from selecting alternative images for optimization.

While enforcing this is appropriate for art direction cases, it is preferable in other instances to allow the browser to autonomously select the optimal images.

The srcset in this section can also provide corresponding sizes attributes. However, doing so would require offering multiple images at various resolutions, which is not a common practice.

Lastly, the img tag is included to set the image displayed when the browser does not support the picture tag or when no media query returns true.

## 3.2. Type Attribute

The source can specify the MIME type within the type attribute, allowing the browser to refuse unsupported image formats before loading them.

This is useful when using formats like webp. It ensures that browsers that do not support a specific file type reject it immediately.

With this capability, developers can feel free to use modern image formats such as webp and avif, which offer advantages in size, knowing that unsupported browsers will simply move on to the next source.

```html
<picture>
  <source type="image/webp" srcset="img-480w.webp">
  <source type="image/jpeg" srcset="img-480w.jpg">
  <img src="img.jpg" alt="Demo Image">
</picture>
```

This is beneficial when a page needs to support multiple image formats.

# References

https://developer.mozilla.org/ko/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images

https://developer.mozilla.org/ko/docs/Web/HTML/Element/img

https://brucelawson.co.uk/2015/why-we-cant-do-real-responsive-images-with-css-or-javascript/

https://cloudfour.com/thinks/responsive-images-101-part-4-srcset-width-descriptors/