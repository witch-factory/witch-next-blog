---
title: Creating a Blog - 3. Structure of Post Detail Page
date: "2023-05-22T00:00:00Z"
description: "Let's create a post detail page for the blog using Contentlayer."
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Setup|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structure Design of Post Detail Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enable Relative Paths for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Minor Page Composition Improvements and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Layout Design of Page Elements|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Design of Main Page Components|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Design of Post List/Content Page Components|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatic Thumbnail Generation for Posts|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements for Fonts, Cards, etc.|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Add View Count to Posts|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Theme and Post Search Functionality|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improvements to Theme Icons and Thumbnail Layouts|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Change Post Categorization to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Main Page Optimization|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Create Pagination for Post List|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Upload Images to CDN and Create Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implement Infinite Scroll on Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

This time, let’s create the post detail page for the blog. We will refer to the Markdown format. Many of the pages listed in the references below were helpful.

# 1. Importing Markdown

## 1.1. Installation and Configuration of Contentlayer

We can easily achieve this by using a library called Contentlayer. Let's install the necessary libraries.

```
npm install contentlayer next-contentlayer rehype-highlight rehype-pretty-code shiki
```

Next, configure the `next.config.js` to register the Contentlayer plugin.

```js
// next.config.js
const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
};

module.exports = withContentlayer(nextConfig);
```

Set up import path aliases in `tsconfig.json`.

```json
// tsconfig.json
// Source: https://yiyb-blog.vercel.app/posts/nextjs-contentlayer-blog
{
  // ...
  "compilerOptions": {
    // ...
    "paths": {
      "@/contentlayer/generated": ["./.contentlayer/generated"],
      "@/contentlayer/generated/*": ["./.contentlayer/generated/*"]
    }
    // ...
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "./.contentlayer/generated"
  ]
}
```

## 1.2. Configure contentlayer.config.js

Now, create and define `contentlayer.config.js`. Here we will set up how Markdown files will be converted.

The metadata we want to include in our posts includes title, description, creation date, and tags. Let's define this. I borrowed this from my eternal frontend lead [Lee Chang-hee](https://xo.dev/)’s [blog code](https://github.com/blurfx/ambienxo).

```js
const postFields = {
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the post for preview and SEO',
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'The tags of the post',
    },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
};
```

We create this as an object because `.md` and `.mdx` files should be treated separately. Let's define two documentTypes as follows. By creating these documentTypes, Contentlayer will automatically import files of the specified formats from `filePathPattern` and place them in the folder defined by `name` in `.contentlayer/generated`.

For example, if defined like below, `.md` files will be placed in the `.contentlayer/generated/Post` folder, and `.mdx` files will be placed in the `.contentlayer/generated/MDXPost` folder.

```js
export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.md',
  contentType: 'markdown',
  ...postFields,
}));

export const MDXPost = defineDocumentType(() => ({
  name: 'MDXPost',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  ...postFields,
}));
```

Next, install the markdown extensions provided by GitHub (automatic links, footnotes, tables, etc.) using remark-gfm.

```
npm install remark-gfm
```

Then, pass the configuration of your application to Contentlayer via makeSource. Don’t forget to import the plugins `remarkGfm` and `rehypePrettyCode`.

```js
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
};

export default makeSource({
  // Path where Markdown files are stored
  contentDirPath: 'posts',
  // Document types to use
  documentTypes: [MDXPost, Post],
  // Define plugins to use for each contentType
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
});
```

# 2. Post Detail Page

## 2.1. Dynamic Routes for md and mdx Files in Posts Page

Now, we need to create dynamic routes using our posts. To do this, we will create the necessary page routes using getStaticPaths and perform the required operations for each page using getStaticProps.

Let’s create a dynamic route assuming that the md files are directly in the root `posts` folder. Create `pages/posts/[slug].tsx`.

All files converted by Contentlayer are stored in `allDocuments` inside `.contentlayer/generated`. We can retrieve converted md files via `allPosts` and mdx files via `allMDXPosts`, but let's retrieve them all at once.

Let's write getStaticPaths while looking at how the converted data is stored in `.contentlayer/generated`. The dynamic path that will come after `posts` is stored in `_raw.flattenedPath`. Thus, we will write it as follows.

```tsx
export const getStaticPaths: GetStaticPaths = () => {
  const paths = allDocuments.map(({_raw})=>{
    return {
      params: {
        slug: _raw.flattenedPath,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};
```

In getStaticProps, we find the document with a `_raw.flattenedPath` matching `params.slug` and pass it as props to the page.

```tsx
export const getStaticProps: GetStaticProps = ({params}) => {
  const post = allDocuments.find(
    (p) => p._raw.flattenedPath === params?.slug
  )!;
  return {
    props: {
      post,
    },
  };
};
```

Now let’s check if the dynamic route was created successfully by retrieving some information from the markdown. We will briefly design the post detail page on the next page.

## 2.2. Designing the Post Detail Page

We need to differentiate between md and mdx. How can we distinguish between them? By examining the converted file in `.contentlayer/generated`, we can determine whether the `post.body` object contains a `code` attribute. The conversion result of an mdx file has the `post.body.code` attribute.

For md files, we will use dangerouslySetInnerHTML to insert the content, while for mdx files, we will use the useMDXComponent provided by Contentlayer.

Although dangerouslySetInnerHTML poses a security risk due to potential XSS attacks, it should not be a major issue here as the source strings are from my own Markdown files.

First, for mdx files, we need to utilize `post.body.code`, but md files do not have this attribute. Therefore, using it directly in `PostPage` will lead to an error reading undefined attributes. Let’s create an MDXComponent that will only be used if this exists.

```tsx
import { useMDXComponent } from 'next-contentlayer/hooks';

interface MDXProps {
  code: string;
}

function MDXComponent(props: MDXProps) {
  const MDX = useMDXComponent(props.code);
  return <MDX />;
}
```

Next, let’s create the PostPage component using a simple HTML structure. We won’t consider styling for now.

```tsx
function PostPage({
  post
}: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.date}</time>
      <ul>
        {post.tags.map((tag: string) => <li key={tag}>{tag}</li>)}
      </ul>
      {'code' in post.body ?
        <MDXComponent code={post.body.code}/> :
        <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
      }
    </article>
  );
}
```

With this setup, we will have a post detail page that displays all attributes of the current post.

# 3. Improvements for Dynamic Routes

## 3.1. Improving Dynamic Routes - Post Detail Page

Currently, I want to classify posts using subfolders under the `/posts` directory. For example, if there are A, B, C, D.. folders in `/posts` with posts inside them, I want to create dynamic routes such as `/posts/A`, `/posts/B`... Additionally, for the posts inside each subfolder, the dynamic routes should be created in the format `posts/A/Apost1`, `posts/A/Apost2`, and so forth.

The categories I currently want to create are CS, Frontend, and other miscellaneous topics, which I’d like to structure like this.

![post-url](./post-url-structure.png)

First, I have created the `/posts/cs`, `/posts/front`, `/posts/misc` folders in the project root directory.

Next, create the `posts/[category]` folder. Let’s consider how to implement the routes depicted in the image above.

In our dynamic route structure, we can represent the dynamic elements with `[]`. Thus, the post detail page will be `/posts/[category]/[slug]`, and the post list page will be `/posts/[category]`.

Here, `category` can be one of `cs`, `front`, or `misc`, while `slug` will be the file name within each folder. How can we retrieve these dynamically? It’s quite simple for the post detail page.

First, transfer the content from `pages/posts/[slug].tsx` to `pages/posts/[category]/[slug].tsx` and delete the existing `[slug].tsx`, as it would overlap with the functionality of the `[category]` folder.

Using `allDocument` as before, we can access the transformed data of each document, and by splitting `_raw.flattenedPath`, we can retrieve each element dynamically. Here’s how it could look.

```tsx
export const getStaticPaths: GetStaticPaths = () => {
  const paths = allDocuments.map(({_raw}) => {
    const pathList = _raw.flattenedPath.split('/');
    return {
      params: {
        category: pathList[0],
        slug: pathList[1],
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};
```

For getStaticProps, we will also use the category to retrieve the appropriate document for the page, in addition to the slug. The component that renders the posts can remain unchanged.

```tsx
export const getStaticProps: GetStaticProps = ({params}) => {
  const post = allDocuments.find(
    (p) => {
      const temp = p._raw.flattenedPath.split('/');
      return temp[0] === params?.category && temp[1] === params?.slug;
    }
  )!;
  return {
    props: {
      post,
    },
  };
};
```

In cases where `[category]/index.tsx` does not exist yet, and if the md files are not stored in a subfolder but directly in `posts`, then the result of splitting `_raw.flattenedPath` would yield only one element. This will cause an error in the above `getStaticProps` when attempting to read `temp[1]` because it doesn’t exist. Therefore, to be complete, we’ll need to create the post list page in the next section.

However, if we only keep md files inside subfolders under `posts/` (for instance, with the index.md for each category), then the dynamic routes should be correctly established.

## 3.2. Improving Dynamic Routes - Post List Page

Now we move on to the post list page. For `posts/[category]`, we only need to retrieve the `category` dynamically.

Based on the previous example, we can split `flattenedPath` and access the appropriate index. Most likely, using `post._raw.flattenedPath.split('/')[0]` will yield the correct result.

However, doing so may result in multiple entries for the same category, which means we could be executing multiple actions for the same route. Internally, it seems like multiple instances of the same page are being created, but it isn’t ideal to have redundant operations. Therefore, I’d like to ensure each category is unique.

From experiments, it seems that if there’s more than one entry corresponding to a particular route, only the most recent one becomes a static page while subsequent requests return the produced page.

This shouldn’t be too difficult to implement. You could gather `post._raw.flattenedPath.split('/')[0]` values and remove duplicates with a Map or retrieve folder names using the fs module. However, none of these methods seem clean to me right now.

But do we really need so many categories? I currently have thought of only three categories, and given they will likely appear in the blog header, I suspect the categories will not exceed five in the current blog layout. Hence, let’s just create a `blog-category.ts` file to keep the necessary categories.

I wrote the following file. The information to include in the type may increase in the future, but for now, it includes the category title and link URL.

```ts
// blog-category.ts
interface Category {
  title: string;
  url: string;
}

const categoryList: Category[] = [
  { title: 'CS', url: '/posts/cs' },
  { title: 'Front', url: '/posts/front' },
  { title: 'Misc', url: '/posts/misc' },
];

export default categoryList;
```

Now, let’s create `pages/posts/[category]/index.tsx`. For getStaticPaths, we can import from `blog-category.ts` and set it up as follows.

```tsx
import categoryList from 'blog-category';

/* Intermediate content */

export const getStaticPaths: GetStaticPaths = () => {
  const paths = categoryList.map((category) => {
    return {
      params: {
        // Convert category title to lowercase since blog-category has mixed casing
        category: category.title.toLowerCase(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};
```

For getStaticProps, we will need to gather all posts under the specified category. We can achieve this by filtering the documents based on the category derived from params and selecting the relevant information to pass as props to the page component. We will also include the category title to display on the page.

```tsx
export const getStaticProps: GetStaticProps = ({params}) => {
  const allDocumentsInCategory = allDocuments.filter((post) =>
    // Ensure category type is correctly handled as string
    post._raw.flattenedPath.startsWith(params?.category as string)
  );

  const postList = allDocumentsInCategory.map((post) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  // Include category title to display on the page
  return { props: { category: params?.category, postList } };
};
```

Now, each page corresponding to the categories from `blog-category.ts` will be created, and the page components will receive the necessary information that belongs to each category’s posts (title, description, creation date, etc.). Let’s design the post list page using this information.

# 4. Designing the Post List Page

Now, let's structure each category page to display the corresponding list of posts and move on to the next section to add some styles and refine a few improvements (or bug fixes). For now, it will be pure HTML, which might be visually unappealing. Although I could aim for a design like the [motherfucking website](https://motherfuckingwebsite.com/), I’d rather not overcomplicate my own blog.

## 4.1. Reusing the Card Component

Upon reflection, the post preview can also utilize the Card component. After all, it already receives the title, description, image, creation date, and URL as props. While using a separate component for styling purposes may be preferable, I don't want to unnecessarily separate semantically similar components. If I absolutely must separate them during styling later on, I can do that, but for now, let's reuse the Card component.

Let’s slightly modify the Card component so that it can accept tags as well.

```tsx
// src/components/card/index.tsx
interface Props {
  title: string;
  description: string;
  image?: string;
  date: string;
  tags?: string[];
  url: string;
}

function Card(props: Props) {
  const { title, description, image, date, tags, url } = props;
  return (
    <article>
      <Link href={url}>
        {image ? <Image src={image} alt={`${title} image`} width={50} height={50} /> : null}
        <h3>{title}</h3>
        <p>{description}</p>
        <time>{date}</time>
        {tags ? <ul>{tags.map((tag: string) => <li key={tag}>{tag}</li>)}</ul> : null}
      </Link>
    </article>
  );
}
```

## 4.2. Structure of the Post List Page

The post list page will receive the category and postList as props. We can display the category as an h1 tag, while the postList can be shown within a ul component using the Card component.

```tsx
// pages/posts/[category]/index.tsx
interface PostMetaData {
  title: string;
  description: string;
  date: string;
  tags: string[];
  url: string;
}

function PostListPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main>
      <h1>{category}</h1>
      <ul>
        {postList.map((post: PostMetaData) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
    </main>
  );
}

export default PostListPage;
```

With this in place, we can display the list of posts on each category page. For example, if I created a CS category, accessing `/posts/cs` will show the list of posts therein. The following is a visual representation of what the `/posts/cs` page might look like with a few example posts added.

![category-route](./category-route.png)

While the design may be lacking, we have an adequate post list page with functioning links thanks to the Card component. In the next article, let’s refine the design by adding some colors and addressing any minor bugs so that the blog appears more user-friendly.

# References

https://github.com/MiryangJung/Build-Own-blog-With-Next.js

https://yiyb-blog.vercel.app/posts/nextjs-contentlayer-blog

https://github.com/blurfx/ambienxo

https://www.contentlayer.dev/docs/getting-started

https://github.com/kagrin97/NextJS-myblog