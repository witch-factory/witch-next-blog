---
title: Handling Multimedia with HTML
date: "2023-08-15T01:00:00Z"
description: "Moving Beyond Boring Text-Only Pages"
tags: ["HTML"]
---

As the web evolves, it has become possible to include multimedia elements such as images and videos on pages. Let's explore how to do this.

# 1. img

To insert an image in HTML, the `<img>` tag is used. The `<img>` tag is a void element that does not contain any internal content or closing tag, but the `src` attribute is required. It is also recommended to specify the `alt` attribute, which indicates alternative text.

The `src` attribute must provide a file format that is supported by the user agent. Refer to the [Web browser image format support guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types).

The `src` attribute indicates the path of the image to be inserted, which can be expressed as an absolute path, a relative path, or a URL. Some search engines read image file names for SEO purposes, so it is advisable to give meaningful names to files. For instance, `profile.jpg` is better than `img234395.jpg`.

```html
<img src="assets/profile.jpg">
```

However, it is not advisable to directly use the address of another website in the `src`. This practice, known as hotlinking, is unethical as it uses someone else's bandwidth and provides no control over the image should the external site go down or images be deleted.

Images are inline elements but occupy space by default, appearing like `inline-block` elements.

The `<img>` tag is a [replaced element](https://developer.mozilla.org/ko/docs/Web/CSS/Replaced_element). It is not affected by the styles of the current document, with its rendering result treated as an external object, separate from the CSS formatting model. It's better to place `<img>` inside boxes like `<div>` and control it with properties like `object-fit`.

## 1.1. alt Attribute

By assigning a string to the alt attribute of the `<img>` tag, alternative text can be provided when the image fails to load. This is shown if the path or file name is incorrect or if loading fails.

Additionally, screen readers will read the `alt` attribute, making it beneficial to use when an image can be described in text. Search engines also read the `alt` attribute, aiding in search engine optimization (SEO).

Browsers like Lynx, which support only text, also require the alt attribute for their users.

Therefore, the alt attribute should contain a description that can be provided to users when the image does not appear, explaining the purpose of the image or providing a description that can substitute any text included in the image.

```html
<img src="assets/profile.jpg" alt="Profile Picture">
```

If the alt attribute is entirely unspecified, it indicates that the image is not a critical part of the content or cannot be expressed as text.

Designating it as an empty string also indicates that the image is not an essential part of the content.

## 1.2. Other Attributes

The `width` and `height` attributes can specify the size of the image. The provided numbers are interpreted as pixels, without units. `width="100"` means the width is set to 100px. By predefining the image size, the browser can already determine how large the image will be rendered before downloading it, thus reducing layout shift and improving user experience.

However, it is preferable to specify image sizes using CSS rather than HTML attributes; alternatively, image editing tools could be utilized.

The `title` attribute can set the image title, which appears when hovering over the image. However, many screen readers do not read this attribute, so if the description of the image contains critical information for users, it is better to use the alt attribute.

Regarding image copyrights, useful content can be found in [MDN documentation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML#searching_for_permissively-licensed_images), including free image sites.

## 1.3. Adding Captions with figcaption

To add a caption to an image, you can wrap it in a `<div>` and include both `<img>` and `<p>` tags inside. 

However, this does not convey the meaning of connecting a caption to a specific image. Thus, you can use the HTML5 `<figure>` and `<figcaption>` tags, which serve to attach captions to images.

```html
<figure>
  <img src="assets/profile.jpg">
  <figcaption>My Profile Picture</figcaption>
</figure>
```

The elements within a figure tag do not necessarily need to be images; videos, tables, or code can also be included.

You can also use CSS's `background-image` property to insert images. However, this does not allow for the image to carry semantic meaning within the page. If the image is not purely decorative, it is better to insert it using the `<img>` tag for semantic purposes.

## 1.4. When Images Cannot Be Loaded

Errors occur when the `src` attribute is empty, null, or equals the current URL, or if the image itself or its metadata is corrupt, or if the image format is unsupported.

If an error handler is registered with the `onerror` global attribute, that handler will be triggered when the aforementioned errors occur.

# 2. map, area

The `<map>` tag is used in conjunction with the `<area>` tag to define clickable image maps. Multiple `<area>` tags are placed within `<map>`, and the `usemap` attribute in `<img>` connects the map to the image.

The `<map>` tag must have a name attribute that is unique across all documents, and if there is an id attribute, it must match the name.

The `<area>` element can only be used within the `<map>` element and defines clickable regions of the image, adding hyperlinks.

You can generate map tags corresponding to an image at [imagemap.org](https://imagemap.org/).

# 3. audio

The `<audio>` tag allows you to insert an audio file onto the page. You can specify the audio source using the `src` attribute or by including `<source>` elements within the tag. When multiple audio sources are specified, the browser chooses the most suitable one.

```html
<audio controls>
  <source src="assets/audio.mp3" type="audio/mpeg">
  <source src="assets/audio.ogg" type="audio/ogg">
  <!-- Fallback content can go here. -->
</audio>
```

The audio tag has no visual content to display, so it cannot use `width` or `height` attributes for dimensions. Similarly, the `poster` attribute is not supported.

However, considering accessibility, it is appropriate to provide captions and subtitles for audio as well. The problem is that the audio tag currently does not provide WebVTT. Therefore, you need to either find a library that provides it or implement it yourself. 

Alternatively, you can provide audio using the video tag, though using the audio tag generally offers a better user experience.

# 4. video

Using the `<video>` tag, you can insert videos into the page. This tag has a `src` attribute, which specifies the path of the video to be inserted, similar to the `<img>` tag.

By specifying the controls attribute, you provide users with an interface to rewind, adjust volume, and navigate. When used, all control elements of the video player will be displayed.

```html
<video src="assets/video.mp4" controls></video>
```

Instead of using the controls attribute, you can use the JS HTMLMediaElement API to create control elements manually.

You can also insert `<p>` tags inside the video tag to prepare fallback content for browsers that do not support videos. This content acts as a fallback for users when the video does not display, such as linking to the video.

```html
<video src="assets/witch.mp4" controls>
  <p>
    This browser does not support videos. Please watch through the <a href="assets/witch.mp4">video link</a>.
  </p>
</video>
```

## 4.1. Providing Multiple Video Sources

Since different browsers may support different video formats, the source video you provide may not play in all cases. 

To address this issue as we did with `audio` or `picture`, we can provide multiple sources so the browser can find the format it supports and play it. You can use `<source>` tags for this.

```html
<video controls>
  <source src="assets/video.mp4" type="video/mp4">
  <source src="assets/video.webm" type="video/webm">
  <source src="assets/video.ogv" type="video/ogg">
</video>
```

Previously, we placed the video file path in the `src` attribute of the video tag, but now we can use `<source>` tags to provide multiple sources. This allows the browser to scan the `src` of the source tags and play the first video with a supported codec.

The `<source>` tag can be used similarly in the `picture`, `audio`, and `video` tags.

Furthermore, the `<source>` tag allows you to specify the media type (MIME type) using the `type` attribute. This enables browsers to skip unsupported video codec types immediately.

If the type attribute is not specified, the browser will load the file and check the codec to determine if it can play it, which takes time; therefore, specifying the type attribute is advisable.

For guidance on finding the most suitable video codec, refer to the [Media types and format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats).

## 4.2. Other Video Attributes

Additionally, there are `width` and `height` attributes that allow you to specify the size of the video while maintaining its aspect ratio. If you specify height/width with a different ratio, the video will stretch to fill the width, and the uncovered areas will be filled with the default background color.

You also have `autoplay`, `loop`, and `muted` attributes. The autoplay attribute automatically plays the video, loop repeats the video, and muted mutes the audio.

The `poster` attribute specifies the image to display before the video loads. The `preload` attribute is related to buffering.

## 4.3. Adding Subtitles to Videos

People who are hard of hearing, are in noisy environments, or do not understand the language of the video may require subtitles.

Subtitles can be provided using a WebVTT file and the `<track>` tag.

A WebVTT file is essentially a subtitle file that specifies multiple subtitle strings along with start and end times for displaying each subtitle. You can also designate subtitle positions.

To display subtitles, save a `.vtt` file to an appropriate location and specify this file using a `<track>` element within the `<video>` or `<audio>` tags.

```html
<video controls>
  <source src="assets/video.mp4" type="video/mp4">
  <source src="assets/video.webm" type="video/webm">
  <source src="assets/video.ogv" type="video/ogg">
  <track src="assets/subtitles.vtt" kind="subtitles" srclang="en" label="English">
</video>
```

The kind attribute of the `<track>` tag allows you to specify the type of subtitle: subtitles, captions, descriptions, chapters, metadata, etc.

Subtitles refer to `subtitles`, captions refer to `captions`, descriptions denote `descriptions`, chapters stand for `chapters`, and metadata refers to `metadata`.

As mentioned, the `.vtt` file is designated through the `<track>` tag, which should come after all `<source>` tags.

You can also specify the subtitle's language using the `srclang` attribute in the `<track>` tag, and use the `label` attribute to inform people which language the subtitles are in.

```html
<track kind="subtitles" src="subtitles_es.vtt" srclang="es" label="Spanish" />
```

As noted, the `<track>` element specifies timed text tracks like subtitles as a child of media elements.

# 5. Embedded Content

Beyond multimedia content, various other contents can be included.

This includes the `<embed>`, `<iframe>`, `<object>`, `<portal>`, `<picture>`, and `<source>` tags.

There are also `<svg>` and `<math>` tags that allow direct insertion of vector graphics and MathML into HTML documents.

## 5.1. A Brief History

In the past, parts of a website were referred to as frames, and the main document containing the frame was called a frameset. Thus, pages were seen as a collection of frames.

The introduction of Flash in the late 90s allowed for the embedding of various contents such as video and animations onto the web. Flash, through ActionScript, controlled videos and enabled the creation of animations with significantly smaller file sizes, dominating the 2000s.

Though elements like `<object>` and `<embed>` enabled similar tasks, their popularity diminished due to accessibility and security issues.

As Flash waned in popularity and HTML5 emerged, inserting other content into web pages using `<iframe>`, `<embed>`, and `<object>` tags became possible.

## 5.2. iframe

The `<iframe>` tag allows you to embed another HTML page within the current page. You can specify another web page using the `src` attribute of the `<iframe>` tag.

When you choose share/embed on YouTube, you can copy the `<iframe>` tag corresponding to that video, such as the following example:

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/b7Pt4hHGi2I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
```

The embedded page maintains its own history. When the back button is pressed, it navigates not to the current page but to the previous page of the embedded page. Moreover, because it is managed as an entirely separate document, adding an iframe to a page consumes extra resources.

Common attributes used in the `<iframe>` tag include `width`, `height`, `src`, and `allowfullscreen`. The width and height attributes specify the dimensions of the inserted page.

For the `src` attribute, to improve loading speed, it is advisable to specify it via JavaScript after the main page has loaded, reducing overall page load time.

The `allowfullscreen` attribute indicates whether the embedded page can be viewed in full screen through the Fullscreen API.

In addition, any content placed between `<iframe>` tags serves as fallback for browsers that do not support `<iframe>`.

### 5.2.1. Security Issues with iframes

For instance, let’s attempt to embed the Naver page with an `<iframe>` tag.

```html
<iframe
  src="https://www.naver.com/"
  width="100%"
  height="500"
  allowfullscreen
>
</iframe>
```

However, the Naver page does not load correctly.

![iframe Loading Failed](./iframe-denied.png)

This occurs because `<iframe>` can be a vector for hacker attacks. Hackers can exploit `<iframe>` to maliciously alter a specific page or attempt to leak sensitive information.

One type of HTML injection is called iframe injection, which involves inserting an `<iframe>` tag into the page and setting its size to zero to hide it. This means users visually have no indication that an `<iframe>` has been inserted, potentially leading them to load a malicious page without their knowledge.

Additionally, well-known pages are likely to be embedded frequently, which increases server costs if this is allowed for all. Consequently, many pages adopt measures to prevent embedding using `<iframe>`. For example, the MDN page sends the `X-Frame-Options: DENY` header to block `<iframe>` embedding.

Thus, it is essential to insert iframes only when necessary and be mindful of copyrights.

Furthermore, consider utilizing HTTPS. Using Let's Encrypt allows you to have HTTPS for free.

Other necessary considerations include:

### 5.2.2. Sandbox Attribute

The `sandbox` attribute is available for iframes. It enables you to restrict allowed operations on the embedded content.

Content without the sandbox attribute can execute JavaScript or open new windows, increasing the potential for malicious attacks.

The sandbox attribute is a string that specifies permitted operations. If it is designated as `sandbox=""`, all operations are prohibited.

For example, adding `allow-modals` to the sandbox string would allow the embedded page to display modal dialogs. You can also allow several operations through whitespace-separated values in the iframe's sandbox attribute.

However, note that applying both `allow-scripts` and `allow-same-origin` options in the sandbox concurrently can enable the iframe content to execute JavaScript that bypasses the same-origin policy, thus best to avoid using these two attributes together.

### 5.2.3. CSP Directive Settings

[CSP](https://developer.mozilla.org/ko/docs/Web/HTTP/CSP) adds an additional security layer to protect pages from threats like XSS attacks. It provides the `Content-Security-Policy` HTTP header designed to enhance HTML document security.

To address security issues with iframes, you can configure CSP settings to send the `X-Frame-Options` header. This header designates whether the page can be embedded in an iframe.

If set to deny, access through an iframe within the same site is also blocked. Setting it to sameorigin allows frame access only within the same site. By appropriately configuring the `X-Frame-Options` header, you can mitigate some iframe security issues.

These CSP settings can be set via meta elements, but it is preferable to configure them when setting up a web server. Notably, you cannot configure the `X-Frame-Options` header through the meta tag. This will be covered in more detail in a later section on HTTP.

## 5.3. embed, object

The `<iframe>` tag facilitates embedding other HTML pages into your page, while `<embed>` and `<object>` tags are used to include external content such as PDFs into the page. However, their usage is not very common. These elements may be utilized for embedding plugin content.

```html
<embed src="./dummy.pdf" type="application/pdf" width="100" height="200" />
<object data="./dummy.pdf" type="application/pdf" width="100" height="200">
  <p>Alternative Text</p>
</object>
```

The `<object>` tag is generally used more frequently to embed something in the page. Additionally, `<embed>` does not support placing alternative content, whereas `<object>` allows adding alternative content between its tags.

Since some older browsers only support the `<embed>` tag, if you need compatibility across all browsers, both tags should be used. For instance, `<embed>` can be placed as alternative content within `<object>`.

```html
<object type="application/pdf"
    data="/media/examples/In-CC0.pdf">
    <embed type="application/pdf"
    src="/media/examples/In-CC0.pdf">
</object>
```

## 5.4. svg

[Inserting Vector Graphics into the Web](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Adding_vector_graphics_to_the_Web)

[SVG](https://developer.mozilla.org/ko/docs/Web/SVG) stands for Scalable Vector Graphics, a language used to describe two-dimensional vector graphics with XML.

Just as you write text in HTML, you describe graphics using SVG. You can draw circles with the `<circle>` tag and rectangles using the `<rect>` tag, among other tags that allow the creation of various graphics. [More information on SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)

```html
<svg width="100%" height="100%">
  <rect width="100%" height="100%" fill="black" />
  <circle cx="150" cy="100" r="90" fill="red" />
</svg>
```

You can create simple SVGs directly as above; however, creating complex graphics can be challenging. Programs like [Inkscape](https://inkscape.org/ko/) are helpful for this task.

However, SVGs can easily become complex, resulting in larger file sizes and increased difficulty in creation, making raster images preferable for complex images like photos.

### 5.4.1. Adding SVG to a Page

There are several methods to incorporate SVG into a page. You can insert an SVG file into an image tag's src attribute.

This method is straightforward due to its familiar syntax and allows functionalities such as alt text. You can also create hyperlinks with images, and browsers will cache the images for quicker loading.

However, you cannot control the image via JavaScript, and for CSS, you would need to include inline CSS in the SVG code as external CSS stylesheets are ignored in the SVG file. The same limitation applies to pseudo-classes in CSS (e.g., :hover).

In some browsers that do not support SVG, you can use the srcset attribute to provide alternative content. However, this feature is only supported in modern browsers. Thus, browsers that support SVG will use the SVG file in the srcset attribute, while unsupported browsers will fall back to the PNG file in the src attribute.

```html
<img src="image.png" srcset="image.svg" alt="SVG Image" />
```

You can also embed SVG using a CSS background image, but you will face the same limitation as when using the img tag concerning JavaScript control over the SVG.

To overcome these limitations, you can use inline SVG, which directly inserts the SVG into the HTML page. Open the SVG file in a text editor, copy the code, and paste it into your HTML file.

```html
<svg width="300" height="200">
  <rect width="100%" height="100%" fill="green" />
</svg>
```

This method reduces the number of HTTP requests, thereby decreasing loading times, and allows you to apply styles to SVG elements using classes, IDs, etc. Inline SVG is the only way to apply CSS interactions (like :hover) and CSS animations to SVG.

However, inserting SVG code directly into the HTML file can lengthen the code and makes it impossible to reuse. Furthermore, the browser cannot cache the SVG file.

Lastly, you can insert the SVG file using an iframe tag by placing the SVG file in the src attribute of the iframe.

```html
<iframe src="mysvg.svg" width="500" height="500" sandbox>
  <img src="mypic.png" alt="My Picture" />
</iframe>
```

However, both SVG and the webpage have the same origin, which means you cannot apply JS to the SVG, and it will not function in browsers that do not support iframe, even with SVG support. Generally, rendering SVG with an iframe is not a recommended approach.

## 5.5. Adding Responsive Images

For adding responsive images, refer to the separate post: [Getting Responsive Images with HTML](https://witch.work/posts/html-responsive-image) using the picture tag.

## 5.6. portal

The `<portal>` tag is a similar tag to `<iframe>`, supporting the embedding of other HTML pages, yet it is still experimental and lacks browser support at this time. [You might study this document in the future](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/portal).

# References

https://developer.mozilla.org/ko/docs/Learn/HTML/Multimedia_and_embedding