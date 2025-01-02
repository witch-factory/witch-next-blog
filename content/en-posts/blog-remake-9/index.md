---
title: Creating a Blog - 9. Generating Post Thumbnails
date: "2023-05-30T01:00:00Z"
description: "Automatically generate thumbnail images for posts using canvas."
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Settings|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of the Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structure Design of the Detailed Post Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enabling Relative Path for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Minor Page Composition Improvements and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Designing Page Element Layout|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Main Page Component Design|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Post List/Content Page Component Design|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatically Generate Post Thumbnails|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements for Fonts, Cards, etc.|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Counts to Posts|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Theme and Post Search Functionality|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improvements in Theme Icons and Thumbnail Layouts|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Post Classification to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Main Page Operational Optimization|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Post List Pagination|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

Finally, we return to the task of creating post thumbnails for the Card component. A post has been written to generally decorate the other pages. A considerable amount of time was spent mainly creating the Table of Contents (TOC).

# 1. Planning

The sole objective of this article is to create a post thumbnail.

The `Card` component, visible in the post list, acts as a preview of the current post, so thumbnails can be added here, and they can also be used for open graph images. This will aid in understanding the posts, generate link previews, and reduce the width of the text line within the cards on the post list page, enhancing user focus.

The reason putting the thumbnail reduces the text line width in the cards is due to the following layout.

![card-layout](./card-layout.png)

However, there is much to be done for this. What images should be used for the thumbnails?

If there are images used in the post, it would be reasonable for that image to serve as the thumbnail. Of course, I do not expect that it will always summarize the contents of the post succinctly, but let’s proceed with that assumption for now. We can change it later if it appears odd.

The bigger challenge arises when there are no images in the post. In this case, what should be designated as the thumbnail? Perhaps it should consist of the post's title or part of the Table of Contents (TOC) that summarizes the content. Let’s dynamically generate such thumbnails.

Previously, I defined a type in the `Card` component that allows images to be added. Therefore, we just need to consider how to retrieve the images. We only need to pass the thumbnail image to the `Card` component somehow from `src/pages/posts/[category]/index.tsx`.

# 2. Concept

First, I considered that since the contents of the md files are stored as strings in HTML format, I can parse the `src` of the `img` tags using a regular expression and use them as thumbnails. I attempted this and had some success.

But what about `mdx` files? Since they are converted into code, finding the used images becomes tricky. Although there are libraries available, I was not keen on using them.

However, we already know how to handle the internal element hierarchy of both md and mdx files using a remark plugin.

Hence, I thought of the following approach:

1. Identify image elements on the AST using a remark plugin and parse their `src`.
2. If no image exists, generate thumbnails using the title and heading elements as a source.

# 3. When an Image Exists in the Post

First, let’s create a plugin: make `src/plugins/make-thumbnail.mjs`.

This plugin will traverse the AST created from markdown, extract all image URLs, and pass the first URL as the thumbnail. If there are no images in the post, it simply skips adding any thumbnail.

```js
// src/plugins/make-thumbnail.mjs
import {visit} from 'unist-util-visit';

// Extract all images
function extractImgSrc(tree) {
  const images = [];
  visit(tree, 'image', (node) => {
    images.push(node.url);
  });
  return images;
}

export default function makeThumbnail() {
  return function(tree, file) {
    const images = extractImgSrc(tree);
    if (images.length > 0) {
      file.data.rawDocumentData.thumbnail = images[0];
    }
  };
}
```

Now, add this plugin to `contentlayer.config.js` as a remark plugin.

```js
// contentlayer.config.js
export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [MDXPost, Post],
  markdown: {
    // Add to this section as a plugin
    remarkPlugins: [remarkGfm, changeImageSrc, headingTree, makeThumbnail],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
  mdx: {
    remarkPlugins: [remarkGfm, changeImageSrc, headingTree, makeThumbnail],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], highlight],
  },
});
```

By implementing this, we can confirm that the JSON converted file has a thumbnail entry. However, this will only contain the image path if the post contains images. In the case of posts with images, the thumbnail will be generated by `make-thumbnail.mjs`.

# 4. When No Image Exists in the Post

In such cases, we need to create the image dynamically. Recently, a library named `@vercel/og` has been released by Vercel, meant for Open Graph image generation, but let's try using it.

```bash
npm i @vercel/og
```

Following the [official documentation](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation#usage), I created `src/pages/api/thumbnail.tsx` and wrote the following:

```tsx
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};
 
export default function handler (request: NextRequest) {
  try {
    const { nextUrl: { search } } = request;
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const title = params.title;

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {title}
        </div>
      ),
      {
        width: 1200,
        height: 600,
      },
    );
  }
  catch (error) {
    console.error(error);
    return new Response('Failed to generate thumbnail', { status: 500 });
  }
}
```

By accessing a URL like `blog address/api/thumbnail` and passing the title as a query string, a picture displaying the title prominently will be generated. This can then be used as a thumbnail source.

But would this work well with Cloudflare Pages where I plan to deploy my blog? After trying it out, it worked, but there were significant hurdles.

# 5. Deployment on Cloudflare

I plan to deploy my blog on Cloudflare. However, since `@vercel/og` is a library developed by Vercel, I wondered if it would only function correctly when deployed by Vercel. Therefore, I decided to conduct an experiment by deploying on Cloudflare.

Naturally, since Next.js is created by Vercel, it is most optimized for that platform. Thus, there were several issues when deploying on Cloudflare, in addition to needing to address concerns beyond just `@vercel/og`.

Fortunately, [Cloudflare officially started supporting Next.js deployment late last year](https://blog.cloudflare.com/next-on-pages/), but it is understandably not as seamless as deploying via Vercel.

Below is the process I followed to resolve issues while deploying Next.js on Cloudflare, referencing the [Cloudflare Next.js deployment documentation](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/).

First, install the necessary Cloudflare package for Next.js deployment.

```bash
npm install --save-dev @cloudflare/next-on-pages
```

Then create a page and link it to a GitHub repository under the Workers & Pages menu. The process is well described in [a blog post by Jojoldu](https://jojoldu.tistory.com/657).

Since I will be using API routes, I chose regular Next.js as my framework preset, not `Next.js (Static HTML Export)`.

Following my previous article, I raised the Node version used in Cloudflare's build to `17.9.1`. 

The official documentation indicates that Next.js requires Node.js version 16 or higher, thus prompting the increase in Node version.

Then when attempting to deploy, it fails. Reading the error message suggests that the `nodejs_compat` compatibility flag is the issue.

Setting the production and preview compatibility flags to `nodejs_compat` under Workers and Pages > Visit My Project > Settings > Functions resolved that.

![compatibility-flag](./compat_flag.png)

However, now the images are not appearing correctly. It has been stated that [Next.js images are not fully supported on Cloudflare](https://github.com/cloudflare/next-on-pages/issues/94), so I decided to disable Next.js image optimization. In `next.config.js`, I set `images.unoptimized` to `true`.

```js
// next.config.js
const nextConfig = {
  images: {
    /* Add this part */
    unoptimized: true,
  },
  compress: true,
  reactStrictMode: true,
  swcMinify: false,
};
```

Next, I encountered a type error. In the section where I filtered the data returned by the `getSortedPosts()` function, there was an error indicating that the types of the function arguments were not defined.

```tsx
/* Here, the filter function argument 'post' has no type definition */
const categoryPostList = getSortedPosts().filter((post) => {
  return post._raw.flattenedPath.split('/')[0] === category.url.split('/').pop();
}).slice(0, 3);
```

Thus, I ensured to define the type of `post` from the `DocumentTypes` defined in `contentlayer/generated`.

```tsx
const categoryPostList = getSortedPosts().filter((post: DocumentTypes) => {
  return post._raw.flattenedPath.split('/')[0] === category.url.split('/').pop();
}).slice(0, 3);
```

I attached types wherever they were necessary that were related to `getSortedPosts()`, and I continuously repeated the tedious cycle of deploying (which took about 5 minutes), checking for bugs, and fixing them.

However, the previous setup of `@vercel/og` ceased to function. It does not work on Cloudflare...

# 6. Creating Thumbnails On Cloudflare

Cloudflare introduced support for generating Open Graph images in April 2023. This works similarly to the Vercel worker, and the API specifications remain unchanged. It is a fresh version 0.1.0.

Let’s attempt to use the Cloudflare version of `@vercel/og` by referencing the [official documentation](https://developers.cloudflare.com/pages/platform/functions/plugins/vercel-og/).

```bash
npm install @cloudflare/pages-plugin-vercel-og
```

However, despite attempting to work with this for an entire day, it did not go as expected. In fact, even when using `@vercel/og` on Vercel, images were sometimes not generated. I suspect that there may have been issues with Korean encoding during that process. Although there appears to be something termed [og-image-korean](https://morethanmin.com/posts/how-to-generate-dynamic-og-image), it seems it would only work with Vercel.

## 6.1. Generating Images Using Canvas

Since the thumbnails are primarily composed of text (such as titles) and static images, I decided to proceed with manual image generation using canvas.

I removed the previous `@vercel/og` plugin and installed canvas:

```bash
npm uninstall @cloudflare/pages-plugin-vercel-og
npm install canvas
```

This yielded a series of serious errors; it seemed that canvas could not be installed.

```bash
npm ERR! code 1
npm ERR! path /Users/kimsunghyun/Desktop/nextjs-blog/node_modules/canvas
npm ERR! command failed
...
```

It appeared the issue was with `node-pre-gyp`. I found an alternative [canvas API](https://github.com/Brooooooklyn/canvas) that does not rely on it and is claimed to be faster. This one is written in Rust and doesn’t require system dependencies.

```bash
npm install @napi-rs/canvas
```

Using this, let’s modify `make-thumbnail.mjs` to generate a simple thumbnail with just the post title when there’s no image present. After tracking the file object structure through `console.log`, I determined that the original content is stored in `file.value`, and splitting that on line breaks showed that the second element contained the title.

```js
export default function makeThumbnail() {
  return function(tree, file) {
    //console.log(file);
    const images = extractImgSrc(tree);
    if (images.length > 0) {
      file.data.rawDocumentData.thumbnail = images[0];
    }
    else {
      const title = file.value.split('\n')[1];

      const canvas = createCanvas(300, 320);
      const ctx = canvas.getContext('2d');
      ctx.fillText(title, 50, 150);
      const b = canvas.toBuffer('image/png');

      file.data.rawDocumentData.thumbnail = `data:image/png;base64,${b.toString('base64')}`;
    }
  };
}
```

By implementing this, if no image exists in the post, an image is successfully generated and stored in `file.data.rawDocumentData.thumbnail`. However, the text still appeared broken; I found that specifying a font was necessary. Thus, I decided to utilize a free font provided by Google Fonts.

Interesting tidbit: when characters are unsupported in a font, they appear as square blocks—these are called "tofu". The name "Noto" signifies that this font does not have such blocks.

```
Is there a cost for these fonts?
No, all Google Fonts are open-source and free.
- From Google Fonts FAQ
```

So, I downloaded the otf files for [NotoSansKR](https://fonts.google.com/noto/specimen/Noto+Sans+KR) and placed them in the `/font` directory, specifying the font as follows.

```js
import {join} from 'path';
import path from 'path';

import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import {visit} from 'unist-util-visit';

const __dirname = path.resolve();
GlobalFonts.registerFromPath(join(__dirname, 'fonts', 'NotoSansKR-Light.otf'), 'NotoSansKR');

// Extract all images
function extractImgSrc(tree) {/* omitted */}

export default function makeThumbnail() {
  return function(tree, file) {
    //console.log(file);
    const images = extractImgSrc(tree);
    if (images.length > 0) {
      file.data.rawDocumentData.thumbnail = images[0];
    }
    else {
      const title = file.value.split('\n')[1];

      const canvas = createCanvas(300, 300);
      const ctx = canvas.getContext('2d');
      /* Specify font */
      ctx.font = '35px NotoSansKR';
      ctx.fillText(title, 0, 100);
      const b = canvas.toBuffer('image/png');

      file.data.rawDocumentData.thumbnail = `data:image/png;base64,${b.toString('base64')}`;
    }
  };
}
```

Now the thumbnails can be generated correctly. Let’s refine them further.

## 6.2. Thumbnail Image Composition

Let’s remove `title:` from the text being rendered and consider the layout. The title should definitely be included, along with perhaps two heading subheadings for additional context. Additionally, I want to incorporate the title of my blog.

By designing a layout based on these elements, I can structure it as follows.

![Thumbnail Layout](./thumbnail-layout.png)

Now, let’s implement the `createThumbnailFromText` function. We’ll initialize a canvas of roughly 400x300. Since there will be asynchronous image processing, we will define it as an async function.

```js
async function createThumbnailFromText(title, headings, filePath) {
  const width = 400;
  const height = 300;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
}
```

We need to construct several necessary functions. First, create the `initCanvas` function, which paints the canvas white with a simple white rectangle.

```js
function initCanvas(ctx, width, height) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000';
}
```

Next, let's create the `drawTitle` function that breaks the title into lines based on a specified character limit and paints those lines one by one on the canvas.

```js
// A function that inserts line breaks when maxWidth is exceeded
const stringWrap = (s, maxWidth) => s.replace(
  new RegExp(`(?![^\\n]{1,${maxWidth}}$)([^\\n]{1,${maxWidth}})\\s`, 'g'), '$1\n'
);

function drawTitle(ctx, title) {
  // Automatically break words after 15 characters
  title = stringWrap(title, 15);
  title = title.split('\n');
  // Draw each line on the canvas
  ctx.font = '40px NotoSansKR';
  for (let i = 0; i < title.length; i++) {
    ctx.fillText(title[i], 0, 50 + 50 * i);
  }
}
```

Additionally, create a function `drawHeadings` that takes the `headingTree` and retrieves up to two depth 1 (h1) subheadings for the canvas, formatting them suitably based on my regular subheading style without breaking words.

```js
function drawHeadings(ctx, headingTree) {
  const thumbnailHeadings = headingTree.slice(0, 2);
  const headingTexts = [];
  for (let h of thumbnailHeadings) {
    const headingText = h.data.hProperties.title.replaceAll('. ', '-');
    headingTexts.push(headingText);
  }
  headingTexts[headingTexts.length - 1] += '...';
  ctx.font = '20px NotoSansKR';
  for (let i = 0; i < headingTexts.length; i++) {
    ctx.fillText(headingTexts[i], 0, 150 + 25 * i);
  }
}
```

Finally, create a function called `drawBlogSymbol` that retrieves the witch hat image I use as the favicon for my blog and draws it onto the canvas. This image will be rendered at 40x40 pixels, so it should be loaded using await.

```js
async function drawBlogSymbol(ctx, blogName) {
  const hatImage = await fs.readFile(join(__dirname, 'public', 'witch-hat.svg'));
  const image = new Image();
  image.src = hatImage;

  image.width = 40;
  image.height = 40;

  ctx.drawImage(image, 0, 220);

  ctx.font = '20px NotoSansKR';
  ctx.fillText(blogName, 45, 250);
}
```

Now, let’s complete the `createThumbnailFromText` function by invoking all the previously defined functions and encoding the resulting canvas into a PNG file, returning its path.

```js
async function createThumbnailFromText(title, headings, filePath) {
  const width = 400;
  const height = 300;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  initCanvas(ctx, width, height);

  drawTitle(ctx, title);

  drawHeadings(ctx, headings);

  await drawBlogSymbol(ctx, 'Witch-Work');

  const fileName = `${filePath.replaceAll('/', '-').replaceAll('.', '-')}-thumbnail.png`;

  const pngData = await canvas.encode('png');
  await fs.writeFile(join(__dirname, 'public', 'thumbnails', fileName), pngData);
  const resultPath = `/thumbnails/${fileName}`;

  return resultPath;
}
```

This will successfully generate thumbnails in the `/public/thumbnails` directory of my project. Note that the `/public/thumbnails` folder must be created manually, or else an error will occur during the `fs.writeFile`.

As a result of such a configuration, automatically generated thumbnails will appear similar to this:

![Example Thumbnail](./test-thumbnail.png)

In the content layer, if there are any change flags, it seems that thumbnails will be newly created only for modified posts automatically.

# 7. Incorporating Thumbnails

Now, assuming I have formatted a post accordingly, every post's transform data will contain a `thumbnail` attribute. In fact, it’s expected that even if the format is somewhat off, it will still be present.

Now, let’s include this in the post list page’s Card component and also in the `og:image` tag of the post detail page. The `Card` component already has the functionality to incorporate images, so we need to pass the `thumbnail` prop. Adjust `src/pages/posts/[category]/index.tsx` accordingly.

Since the type of `post._raw` is strictly defined, I added some additional length to the code to ensure that I was only passing the `thumbnail` if it exists.

```tsx
// src/pages/posts/[category]/index.tsx
export const getStaticProps: GetStaticProps = ({params}) => {
  const allDocumentsInCategory = getSortedPosts().filter((post: DocumentTypes) =>
    post._raw.flattenedPath.startsWith(params?.category as string)
  );
  
  const {title: category, url: categoryURL} = blogCategoryList.find((c: {title: string, url: string}) => 
    c.url.split('/').pop() === params?.category) as {title: string, url: string};

  const postList = allDocumentsInCategory.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata = {title, description, date, tags, url};
    return 'thumbnail' in post._raw ? 
      ({...metadata, image: post._raw.thumbnail} as PostMetaData) :
      metadata;
  });

  return { props: { category, categoryURL, postList } };
};
```

In the `PostListPage` component, pass the post-specific data directly to the `Card`.

```tsx
// src/pages/posts/[category]/index.tsx
function PostListPage({
  category, categoryURL, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {

  /* SEO info section omitted */

  return (
    <main className={styles.page}>
      <NextSeo {...SEOInfo} />
      <div className={styles.container}>
        <h1 className={styles.title}>{`${category} Posts`}</h1>
        <ul className={styles.list}>
          {postList.map((post: PostMetaData) => {
            return (
              <li key={post.url}>
                {/* Passing all information directly */}
                <Card {...post} />
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
```

Now we can verify that the thumbnails are appropriately appearing on the post list page. Let’s move to ensure the open graph image is also included in `src/pages/posts/[category]/[slug]/index.tsx`. Since the entire post is passed here, we simply have to include `post._raw.thumbnail` in the `SEOconfig`.

```tsx
/* src/pages/posts/[category]/[slug]/index.tsx
SEOinfo object used in the file.
This is passed to <NextSeo {...SEOInfo} />. */
const SEOInfo: NextSeoProps = {
  title: post.title,
  description: post.description,
  canonical: `${SEOConfig.canonical}${post.url}`,
  openGraph: {
    title: post.title,
    description: post.description,
    images: [
      {
        url: `${blogConfig.url}${post._raw.thumbnail}`,
        alt: `${blogConfig.name} profile picture`,
      },
    ],
    url: `${SEOConfig.canonical}${post.url}`,
  }
};
```

# 8. Adjusting Internal Element Placement in the Card

It appears that the thumbnail photo and the intro text in the card are currently too close together.

```tsx
// src/components/Card/index.tsx
function Card(props: Props) {
  const { title, description, image, date, tags, url } = props;
  return (
    <Link className={styles.link} href={url}>
      <article className={styles.container}>
        {image ?
          <div className={styles.imagebox}>
            <Image className={styles.image} src={image} alt={`${image} photo`} width={200} height={200} />
          </div>
          :
          null
        }
        <Intro title={title} description={description} date={date} tags={tags} />
      </article>
    </Link>
  );
}
```

Next, modify the `styles.module.css` to adjust the layout. While I considered resizing the image based on height, it was complicated due to the absence of computed height for the ancestors of the image element. Thus, I opted for a fixed width and height, as it would be consistent across usages.

```css
// src/components/Card/styles.module.css
.container {
  /*border: 1px solid var(--gray5);*/
  border-radius: 1rem;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.link {
  display: block;
  height: 100%;
  padding: 1rem;
  padding-left: 0;
  text-decoration: none;
  color: var(--black);
}

.link:hover {
  padding-left: 1rem;
  border-radius: 1rem;
  color: var(--indigo6);
  background-color: var(--gray1);
}

.image {
  display: block;
  width: 150px;
  height: 120px;
  object-fit: fill;
  margin: 0;
  margin-right: 1rem;
}
```

This ensures that the image dimensions remain constant. 

# References

Dynamic Thumbnail Creation: https://dev.to/xaconi_94/how-to-create-dynamic-nextjs-post-thumbnails-like-dev-to-3ika

Customizing Social Media Previews: https://articles.wesionary.team/customize-social-media-preview-of-your-nextjs-website-links-82f6bce035b

Dynamic OG Image Generation: https://morethanmin.com/posts/how-to-generate-dynamic-og-image

Image Tag Src Parsing: https://stackoverflow.com/questions/14939296/extract-image-src-from-a-string

Next.js Deployment on Cloudflare: https://jojoldu.tistory.com/657

Cloudflare Next.js Deployment Documentation: https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/

Obtaining Query Strings in NextRequest: https://stackoverflow.com/questions/70272983/how-do-i-get-query-string-params-in-nextjs-middleware

Images Support on Cloudflare: https://github.com/cloudflare/next-on-pages/issues/94