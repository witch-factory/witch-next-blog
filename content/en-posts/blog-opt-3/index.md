---
title: Blog Optimization - 3. Image Optimization
date: "2023-06-11T03:00:00Z"
description: "Super Fast Witch: The third installment of blog optimization"
tags: ["blog", "web"]
---

# Blog Creation Series

| Title | Link |
|---|---|
| 1. Basic Settings | [https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1) |
| 2. HTML Design of the Main Page | [https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2) |
| 3. Structure Design of Post Detail Pages | [https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3) |
| 4. Enabling Relative Paths for Images | [https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4) |
| 5. Minor Page Configuration Improvements and Deployment | [https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5) |
| 6. Layout Design of Page Elements | [https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6) |
| 7. Design of Main Page Components | [https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7) |
| 8. Design of Article List/Content Page Components | [https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8) |
| 9. Automatic Generation of Article Thumbnails | [https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9) |
| 10. Design Improvements for Fonts, Cards, etc. | [https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10) |
| 11. Adding View Counts to Posts | [https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11) |
| 12. Page Theme and Post Search Functionality | [https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12) |
| 13. Improvements to Theme Icons and Thumbnail Layout | [https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13) |
| 14. Changing Post Classification to Tag-Based | [https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14) |
| Optimization of Main Page Calculations | [https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1) |
| Creating Pagination for Article List | [https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2) |
| Uploading Images to CDN and Creating Placeholders | [https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3) |
| Implementing Infinite Scroll on Search Pages | [https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4) |

# 1. Image Optimization

This article focuses on overall image optimization. First, let's take a look at Lighthouse's suggestions and diagnostics for the article list page. The score is disappointing, but even the longest journey begins with a single step, so let's do what we can.

![category-page-diagnostics](./category-page-diagnostics.png)

It suggests providing appropriate sizes for images. Let's specify sizes for the `Image` tag in the Card component.

```jsx
function Card(props: Props) {
  /* omitted */
  <Image 
    className={styles.image} 
    src={image} 
    alt={`${image} photo`} 
    width={200} 
    height={200}
    sizes='100px'
  />
  /* omitted */
}
```

Set the image's `minimumCacheTTL` to 30 days, which can be configured in `next.config.js`.

```js
const nextConfig = {
  images: {
    unoptimized: false,
    imageSizes: [64, 384],
    deviceSizes: [768, 1920],
    domains: ['res.cloudinary.com'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  reactStrictMode: false,
  swcMinify: true,
};
```

By opening the browser's developer tools, accessing the Network tab, and inspecting the response headers of the images from the blog page, you will find a `Cache-Control: public, max-age=0, must-revalidate` entry.

Setting the `minimumCacheTTL` will change the `max-age` in the `Cache-Control` header to the specified value. In my case, it was adjusted to 2592000.

While it's recommended to keep this low to avoid intentionally deleting caches, I believe that for images used on a blog, refreshing the cache once every 24 hours is sufficient. If an image update is necessary, a daily refresh should be adequate.

# 2. Trying Cloudinary

I found a very helpful article titled [Building a Fast Animated Image Gallery with Next.js](https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js) published by Vercel!

This blog states that Cloudinary was used to serve images. Let's give this a try.

First, sign up for [Cloudinary](https://cloudinary.com/). I signed up using Google, and you'll see the following screen on your dashboard.

![after-login](./cloudinary-after-login.png)

From the left menu, enter the Media Library to upload assets. Its UI is quite similar to Google Drive, allowing for drag-and-drop uploads of images.

For example, after uploading my profile picture to the samples folder, I could obtain a URL like this. Hovering over the image shows a button to copy the URL. [The structure of the URL is referenced in the official documentation.](https://cloudinary.com/documentation/transformation_reference)

```
https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id_full_path>.<extension>

https://res.cloudinary.com/my_cloud_name/asset_type(image)/delivery_type/version/folder_name/witch_xjp39k.jpg
```

To call this via the API, we first need to set the API keys in `.env.local`. You can retrieve those keys from the Access Keys menu under Settings.

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=replace
CLOUDINARY_API_KEY=replace
CLOUDINARY_API_SECRET=replace
```

Add the following settings in `next.config.js` to allow fetching images from `res.cloudinary.com`.

```js
/* Edit only nextConfig */
const nextConfig = {
  images: {
    unoptimized: false,
    imageSizes: [64, 384],
    deviceSizes: [768, 1920],
    /* Add cloudinary to domains */
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: false,
  swcMinify: true,
};
```

Now we can fetch images using the URL as follows.

```jsx
<Image
  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1686541466/samples/witch_xjp39k.jpg`}
  alt='Profile Picture'
  width={300}
  height={300}
/>
```

To use this on Vercel, add the above environment variables there as well. The current environment variables look as follows.

![vercel environment variables](./vercel-env-var.png)

# 3. Designing the Image Serving System

Previously, all images were included during the build of the website. Now we will be using Cloudinary. But should we completely abandon the existing image storage method?

While it is a possibility, I believe it is not advisable to restrict ourselves to only new methods when changing the storage approach. Since Cloudinary is not unlimited, we might have to revert to the existing storage method in the future. Furthermore, we may end up using another cloud storage solution.

The reason for such concerns is, of course, cost. I can only use a free or very cheap plan, while Cloudinary's paid plans are quite expensive...

![I have no money](./no-money.webp)

Thus, let's allow the user to choose where to store images in `blog-config.ts` under `blogConfig`. The default value will be `local`.

If the value of `blogConfig.imageStorage` is `local`, store it in `public/images`, and if it is `cloudinary`, store it in Cloudinary, while saving two URLs based on the user's setting in `blogConfig.imageStorage`.

```ts
interface BlogConfigType {
  name: string;
  title: string;
  description: string;
  picture: string;
  url: string;
  social: {
    Github: string;
    BOJ: string;
  };
  comment: {
      type: 'giscus';
      repo: string;
      repoId: string;
      category: string;
      categoryId: string;
      lang?: 'ko' | 'en'; // defaults to 'en'
      lazy?: boolean;
    };
    /* Enable selection of image storage */
  imageStorage: 'local' | 'cloudinary'; // defaults to 'local'
  thumbnail: string;
  googleAnalyticsId?: string; // gtag id
}
```

# 4. Main Page Image Optimization

Excluding my profile photo, there are only four images on the main page, which are project images. As these are not dynamically generated, changing them is straightforward. After uploading to Cloudinary, simply change the `src` of the corresponding image tags.

First, in `blog-project.ts`, modify the project image URL type to accommodate both local and Cloudinary URLs.

```ts
// blog-project.ts
export interface projectType {
  title: string;
  description: string;
  image: {
    local: string;
    cloudinary: string;
  };
  url: {
    title: string;
    link: string;
  }[];
  techStack: string[];
}
```

Next, create a `/blog` folder in the Cloudinary media library.

![Create Blog Folder](./new-blog-folder.png)

Upload the project images (those that were in `/public/project`) into this newly created folder. Once the URLs are generated, assign them to the project images in `projectList`.

I was concerned that exposing the entire URL would reveal the Cloudinary cloud name, but according to [Cloudinary's official site](https://cloudinary.com/documentation/how_to_integrate_cloudinary), it’s fine for the cloud name and API key to be exposed.

As long as the API secret remains hidden, we can proceed. Therefore, let's store the Cloudinary URL in `blog-project.ts` as follows.

```ts
const projectList: projectType[] = [
  {
    title: 'Witch-Work',
    description: 'My personally created blog',
    image: {
      local: '/witch.jpeg',
      cloudinary: 'https://res.cloudinary.com/desigzbvj/image/upload/v1686565864/blog/witch_t17vcr.jpg'
    },
    /* URL and techStack properties omitted */
  },
  /* Other project objects omitted */
];
```

In the `ProjectCard` component displaying the projects, use different image URLs based on `blogConfig.imageStorage`.

```tsx
// src/components/projectCard/index.tsx
function ProjectCard({project}: {project: projectType}) {
  return (
    <Link className={styles.wrapper} href={project.url[0].link} target='_blank'>
      <article className={styles.container} >
        <div className={styles.titlebox}>
          <ProjectTitle title={project.title} />
        </div>
        <div className={styles.imagebox}>
          <ProjectImage title={project.title} image={project.image[blogConfig.imageStorage]} />
        </div>
        <div className={styles.introbox}>
          <ProjectIntro project={project} />
        </div>
      </article>
    </Link>
  );
}
```

# 5. Post Thumbnail Image Optimization

Currently, the thumbnails are generated in `src/plugins/make-thumbnail.mjs`, where the file path is stored in `data._raw.thumbnail`. Therefore, let's change the existing file path to `thumbnail.local` and add `thumbnail.cloudinary`.

To do this, we need to upload the images first while generating thumbnails. The current code for thumbnail generation works well, so let's just add the code to upload to Cloudinary in the `makeThumbnail` function.

Upload the image stored in `thumbnail.local` to Cloudinary and save the URL in `thumbnail.cloudinary`. According to the upload API documentation response, the image URL is contained in the `secure_url` of the response. We'll designate this as the thumbnail URL. We will not use the `http` version as it will trigger a security warning.

```js
export default function makeThumbnail() {
  return async function(tree, file) {
    const images = extractImgSrc(tree);
    if (images.length > 0) {
      file.data.rawDocumentData.thumbnail = {
        local: images[0],
      };
    } else {
      const title = file.value.split('\n')[1].replace('title: ', '');
      const { headingTree, sourceFilePath } = file.data.rawDocumentData;
      const b = await createThumbnailFromText(title, headingTree, sourceFilePath);
      file.data.rawDocumentData.thumbnail = {
        local: b,
      };
    }
    /* At this point, there is at least one thumbnail */
    const results = await cloudinary.v2.uploader.upload(
      join(__dirname, 'public', file.data.rawDocumentData.thumbnail.local), {
        folder: 'blog/thumbnails',
        use_filename: true,
      }
    );
    file.data.rawDocumentData.thumbnail.cloudinary = results.secure_url;
  };
}
```

Now, modify the `Card` component to use the thumbnail based on the specified `imageStorage` in `blog-config.ts`. Update the `CardProps` and similar types throughout the code.

```tsx
// src/components/card/index.tsx
export interface CardProps {
  title: string;
  description: string;
  thumbnail?: {
    local: string;
    cloudinary: string;
  }
  date: string;
  tags: string[];
  url: string;
}

function Card(props: CardProps) {
  const { title, description, thumbnail, date, tags, url } = props;
  return (
    <Link className={styles.link} href={url}>
      <article className={styles.container}>
        {thumbnail ?
          <div>
            <Image 
              className={styles.image} 
              src={thumbnail[blogConfig.imageStorage]} 
              alt={`${title} photo`} 
              width={200} 
              height={200}
              sizes='100px'
            />
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

The above section of code, which had to be modified for thumbnail fetching based on `blogConfig.imageStorage`, can be reviewed in the [previous commit history](https://github.com/witch-factory/witch-next-blog/commit/192c4a7adc8604b6a15ccfd7f1f309a149b2893b).

# 6. Removing Duplicates and Optimizing Images

However, there is an issue. Each time I run `dev` or build, `makeThumbnail` continuously executes and uploads images repeatedly.

To resolve this, provide a public ID at upload and set overwrite to false (to prevent overwriting when the same ID exists).

Modify the upload API call in `makeThumbnail` as follows.

```js
export default function makeThumbnail() {
  return async function(tree, file) {
    const images = extractImgSrc(tree);
    if (images.length > 0) {
      file.data.rawDocumentData.thumbnail = {
        local: images[0],
      };
    } else {
      const title = file.value.split('\n')[1].replace('title: ', '');
      const { headingTree, sourceFilePath } = file.data.rawDocumentData;
      const b = await createThumbnailFromText(title, headingTree, sourceFilePath);
      file.data.rawDocumentData.thumbnail = {
        local: b,
      };
    }
    /* At this point, there is at least one thumbnail */
    const results = await cloudinary.v2.uploader.upload(
      join(__dirname, 'public', file.data.rawDocumentData.thumbnail.local), {
        public_id: file.data.rawDocumentData.thumbnail.local.replace('/', '').replaceAll('/', '-').replaceAll('.', '-'),
        folder: 'blog/thumbnails',
        overwrite: false,
      }
    );
    file.data.rawDocumentData.thumbnail.cloudinary =
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_300,f_auto/${results.public_id}`;
  };
}
```

Here, you can see that the image is being resized to 300px and the file format is optimized automatically by including `c_scale,w_300,f_auto` in the URL.

Perform the same optimization on project images by modifying the array in `blog-project.ts` like this.

```ts
// blog-project.ts
const projectList: projectType[] = [
  {
    title: 'Witch-Work',
    description: 'My personally created blog',
    image: {
      local: '/witch.jpeg',
      /* Notice that c_scale,w_400,f_auto is included in between. This format is referenced in the official transformation API documentation. */
      cloudinary: 'https://res.cloudinary.com/desigzbvj/image/upload/c_scale,w_400,f_auto/v1686565864/blog/witch_t17vcr.jpg'
    },
    url: [
      {
        title: 'URL',
        link: 'https://witch.work/'
      },
      {
        title: 'Github',
        link: 'https://github.com/witch-factory/witch-next-blog'
      },
    ],
    techStack: ['Next.js', 'React', 'TypeScript']
  },
]
```

# 7. Providing Blurred Images

No matter how fast the server sending the image is, nothing beats using a smaller image size. So let's prepare a placeholder to use while loading images.

Create a function that generates a blur image from the Cloudinary URL, which we will add in `src/utils/generateBlurPlaceholder.ts`.

Before doing this, install a library called `imagemin`. This library optimizes images, along with `imagemin-jpegtran`. Additionally, install the necessary types for these libraries.

```bash
npm install imagemin imagemin-jpegtran
npm install --save @types/imagemin
npm install --save @types/imagemin-jpegtran
```

This function will fetch a 16px jpg version of the Cloudinary URL image, optimize it using the `imagemin` library, and return it as a base64 encoded string.

```js
// src/utils/generateBlurPlaceholder.ts
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';

export default async function getBase64ImageUrl(imageUrl: string) {
  const response = await fetch(imageUrl.replace('w_300,f_auto', 'w_16,f_jpg'));
  const buffer = await response.arrayBuffer();
  const minified = await imagemin.buffer(Buffer.from(buffer), {
    plugins: [imageminJpegtran()],
  });
  const blurURL = `data:image/jpeg;base64,${Buffer.from(minified).toString('base64')}`;
  return blurURL;
}
```

Then, in the `makeThumbnail` function, use the above function to generate the blurred URL for the thumbnail.

```js
// src/plugins/make-thumbnail.mjs
export default function makeThumbnail() {
  return async function(tree, file) {

    /* Thumbnail generation and Cloudinary upload parts omitted */

    file.data.rawDocumentData.thumbnail.cloudinary =
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_300,f_auto/${results.public_id}`;

    /* The following part for generating the blurURL has been added */
    file.data.rawDocumentData.thumbnail.blurURL = await getBase64ImageUrl(file.data.rawDocumentData.thumbnail.cloudinary);
  };
}
```

Make sure the `Card` component uses this blur placeholder as well.

```tsx
export interface CardProps {
  title: string;
  description: string;
  thumbnail?: {
    local: string;
    cloudinary: string;
    blurURL?: string;
  }
  date: string;
  tags: string[];
  url: string;
}

function Card(props: CardProps) {
  const { title, description, thumbnail, date, tags, url } = props;
  return (
    <Link className={styles.link} href={url}>
      <article className={styles.container}>
        {thumbnail ?
          <div>
            <Image 
              className={styles.image} 
              style={{ transform: 'translate3d(0, 0, 0)' }}
              src={thumbnail[blogConfig.imageStorage]} 
              alt={`${title} photo`} 
              width={200} 
              height={200}
              sizes='200px'
              placeholder={'blurURL' in thumbnail ? 'blur' : 'empty'}
              blurDataURL={thumbnail.blurURL}
            />
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

As a result, you will observe that a blurred image briefly appears while the image loads.

Additionally, the `Image` component has a `style={{ transform: 'translate3d(0, 0, 0)' }}` property added. This performs a CSS transform of vector `(0,0,0)`, essentially resulting in no positional change. 

The reason for using this seemingly pointless CSS is to ensure that some devices use GPU rendering for this element. This is particularly effective in Safari.

While this may not have been a critical need for my blog, other tricks are introduced in the [Next.js Image Gallery Building Guide](https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js).

# References

- Article on building a very fast image gallery with Next.js: https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js
- Next.js image optimization documentation: https://nextjs.org/docs/pages/building-your-application/optimizing/images
- Official documentation for image upload API: https://cloudinary.com/documentation/image_upload_api_reference#upload
- Article covering various image optimization techniques: https://junheedot.tistory.com/entry/Next-Image-load-super-slow
- Documentation on `minimumCacheTTL` discussed in the image optimization section: https://nextjs.org/docs/pages/api-reference/components/image#minimumcachettl
- Article on Next.js image optimization by LogRocket: https://blog.logrocket.com/next-js-automatic-image-optimization-next-image/
- Automatically fetching in webp format: https://cloudinary.com/guides/front-end-development/webp-format-technology-pros-cons-and-alternatives
- Official documentation for Cloudinary image transformations: https://cloudinary.com/documentation/transformation_reference
- Avoiding image duplicates: https://support.cloudinary.com/hc/en-us/community/posts/5126315761682-Best-way-to-avoid-duplicated-files-
- Cloudinary also provides an API for duplicate checking: https://cloudinary.com/blog/how_to_automatically_identify_similar_images_using_phash
- Next.js image loader documentation: https://nextjs.org/docs/app/api-reference/next-config-js/images#example-loader-configuration