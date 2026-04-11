---
title: Creating a Blog - 8. Post List/Detail View Page
date: "2023-05-30T00:00:00Z"
description: "Let's improve the CSS for the post list page and detail view page. Also, work on design, TOC, and SEO."
tags: ["blog", "web"]
---

# Blog Creation Series

| Title | Link |
|---|---|
| 1. Basic Settings | [https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1) |
| 2. HTML Design of the Main Page | [https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2) |
| 3. Structure Design of the Post Detail Page | [https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3) |
| 4. Allowing Images to Use Relative Paths | [https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4) |
| 5. Minor Page Layout Improvements and Deployment | [https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5) |
| 6. Layout Design of Page Elements | [https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6) |
| 7. Main Page Component Design | [https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7) |
| 8. Post List/Content Page Component Design | [https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8) |
| 9. Automatically Generate Post Thumbnails | [https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9) |
| 10. Design Improvements for Fonts and Cards | [https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10) |
| 11. Adding View Counts to Posts | [https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11) |
| 12. Page Theme and Post Search Functionality | [https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12) |
| 13. Improving Theme Icons and Thumbnail Layouts, etc. | [https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13) |
| 14. Changing Post Classification to Tag-based | [https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14) |
| Optimizing Calculations on Main Page | [https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1) |
| Creating Pagination for Post List | [https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2) |
| Uploading Images to CDN and Creating Placeholders | [https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3) |
| Implementing Infinite Scroll in the Search Page | [https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4) |

I was creating the `Card` component for the main page, but since `Card` is also used in the post category page, I wanted to work on creating thumbnails for that.

However, as I began designing it, I realized there were many preliminary tasks that needed to be done, so I decided to first make some minor adjustments to other pages. This post will cover those minor adjustments to the other pages. The thumbnail creation will be addressed in the next post.

# 1. Modifying the Post List Page

In fact, the purpose of the `Card` component seen on the main page has already been created in previous posts. While there is still room for design improvement, all the necessary content is already included. However, since `Card` is also used to display a list of posts by category, we need to design it appropriately for that context.

However, we need to see how the `Card` component is utilized in the post list page, but the post list page has not been designed yet. Therefore, let’s make a few changes just to help us visualize the `Card` component better on the post list page.

I will address it more thoroughly later. (In fact, the post list page is not complex, so if we design the card well, I don't think there will be any major design concerns afterwards.)

We will first wrap the entire post list in a container with a width of 92%, just as we did on the main page, and remove the default styles of the list (ul). We will also add a bit of space between the post blocks. This alone should be enough to create a layout where we can check if the thumbnails fit well.

Open the `pages/posts/[category]/index.tsx` file responsible for the post list page and modify the `PostListPage` component as follows:

```tsx
function PostListPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className={styles.pagewrapper}>
    {/* container and list classes were added */}
      <div className={styles.container}>
        <h1>{category}</h1>
        <ul className={styles.list}>
          {postList.map((post: PostMetaData) => 
            <li key={post.url}>
              <Card {...post} />
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}
```

Then, the CSS for the newly added classes will be written as follows. Since it will maintain the same layout regardless of the width, there is no need for media queries.

```css
// Add the following to pages/posts/[category]/style.module.css
.container {
  width: 92%;
  margin: 0 auto;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

# 2. Applying Global CSS

## 2.1. Global Style

Before creating the post detail view page, a problem arose. I checked the deployed blog on mobile, and the font types and spacing appeared slightly different. Therefore, let's apply global reset CSS.

Edit `src/styles/globals.css`.

I mostly followed the global CSS from [gatsby-starter-lavender](https://github.com/blurfx/gatsby-starter-lavender).

```css
// src/styles/globals.css
:root {
  --white: #fff;
  --black: #000;

  --gray0: #f8f9fa;
  --gray1: #f1f3f5;
  --gray2: #e9ecef;
  --gray3: #dee2e6;
  --gray4: #ced4da;
  --gray5: #adb5bd;
  --gray6: #868e96;
  --gray7: #495057;
  --gray8: #343a40;
  --gray9: #212529;

  --indigo0: #edf2ff;
  --indigo1: #dbe4ff;
  --indigo2: #bac8ff;
  --indigo3: #91a7ff;
  --indigo4: #748ffc;
  --indigo5: #5c7cfa;
  --indigo6: #4c6ef5;
  --indigo7: #4263eb;
  --indigo8: #3b5bdb;
  --indigo9: #364fc7;

  font-family: "Pretendard", apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

h1 {
  font-size: 1.75rem;
}

h2 {
  font-size: 1.5rem;
}

h3 {
  font-size: 1.25rem;
}

h4 {
  font-size: 1rem;
}

h5 {
  font-size: 0.875rem;
}

h6 {
  font-size: 0.75rem;
}

hr {
  margin: 0.25rem 0;
  border: 0;
  border-top: 0.125rem solid var(--gray5);
}

img {
  display: block;
  margin: 0 auto;
}

p {
  margin: 0.75rem 0;
  line-height: 1.625rem;
}

table {
  width: 100%;
  margin: 0.75rem 0;
  border-collapse: collapse;
  line-height: 1.75rem;
}

tr {
  border-bottom: 1px solid var(--gray5);
}

th, td {
  padding: 0.75rem 0;
}

blockquote {
  padding-left: 1rem;
  border-left: 0.25rem solid var(--indigo7);
}

article {
  overflow-wrap: break-word;
}

article :is(ul, ol) {
  margin-left: 2rem;
}

article :is(ul, ol) :is(ul, ol) {
  margin-left: 1.5rem;
}

article :is(ul, ol) li {
  margin: 0.375rem 0;
}

article :is(ul, ol) li p {
  margin: 0;
}

article pre[class^="language-"] {
  border-radius: 0.25rem;
}

pre[class*="language-"], code[class*="language-"] {
  white-space: 'pre-wrap';
}
```

After applying this, the layout of the main page may change slightly. Let's make adjustments to restore it back to its original state.

## 2.2. Header and Footer

There aren’t many layout elements to consider internally, and since classes have been applied to almost everything, there is nothing to fix.

## 2.3. Introduction Component

Links in my introduction are included in the ul that is a descendant of the article tag, hence they are affected by the global CSS. Therefore, we will remove the default margin and reduce the line height of the p tag. Additionally, we will create a `linkbox` class to remove the margin of the li tag that wraps the links.

```css
// src/components/profile/intro/styles.module.css
.description {
  margin: 10px 0;
  word-break: keep-all;
  line-height: 1.2;
}

.linklist {
  display: flex;
  flex-direction: row;
  list-style: none;
  padding-left: 0;
  margin: 0;
  margin-bottom: 0.5rem;
  gap: 0 15px;
}

.link {
  text-decoration: none;
  color: var(--indigo6);
}

.linkbox {
  margin: 0;
}
```

Add the `linkbox` class to the part that wraps the links inside the Intro component:

```tsx
// src/components/profile/intro/index.tsx snippet
<ul className={styles.linklist}>
  {Object.entries(blogConfig.social).map(([key, value]) => (
    {/* Add the linkbox class here */}
    <li key={key} className={styles.linkbox}>
      <Link href={value} target='_blank' className={styles.link}>
        {key}
      </Link>
    </li>
  ))}
</ul>
```

## 2.4. Project Introduction Component

The first thing to address is the left margin of the ul tag and the vertical margin of the li elements. Let's remove these. First, we will apply the `styles.container` class to the article tag that wraps the entire `projectList`, then we will handle the internals of ul and li.

```css
// Add to src/components/projectList/styles.module.css
.container ul {
  margin-left: 0;
}

.container li {
  margin: 0;
}
```

Currently, spacing between individual project components mixes margin and grid display gaps, so let's unify this to use gaps.

Set the gap for the list class of the `projectList` to 1rem.

```css
// Add to src/components/projectList/styles.module.css
.list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 1rem;
}
```

Remove the margin from the project component's container. To align the title of the `projectList` and the project image on the same line, set the left padding of the container to 0. Also, remove the `margin: 0 auto;` setting for the project image to correct its alignment.

```css
// src/components/projectList/project/styles.module.css
.container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  box-sizing: border-box;
  /* padding has been modified */
  padding: 15px 15px 15px 0;
  min-height: 150px;
}

.image {
  border-radius: 1rem;
  /* margin set to 0 */
  margin: 0;
}

@media (min-width: 768px) {
  .container {
    /* padding modified */
    padding: 10px 10px 10px 0;
  }

  .image {
    display: block;
  }
}
```

If the `projectList` is collapsed, there was a problem with row-gap, causing extra space to appear at the bottom. To prevent this, set the row-gap to zero when the list is closed.

However, simply doing this will leave the `list--close` class applied even when the screen width is large, leading to issues where row-gaps are removed in wide viewports. Therefore, let's apply an appropriate gap when the viewport is wide.

```css
.list--close {
  grid-auto-rows: 0;
  overflow: hidden;
  // Disable row-gap when closed
  row-gap: 0;
}

@media (min-width: 768px) {
  .list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
    // Increase gaps when the screen width is wide
    row-gap: 1rem;
    column-gap: 2rem;
  }
}
```

Lastly, add a small bottom margin to the container of the `projectList`, which no longer has spacing from the component below.

```css
// src/components/projectList/styles.module.css
.container {
  margin-bottom: 2rem;
}
```

## 2.5. Post Category Component

Let's make adjustments to the `Category` and `Card` components.

For the Category, simply remove the margin from the ul and provide a little bottom spacing in the container for separation.

```tsx
// src/components/category/index.tsx
function Category(props: Props) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{props.title}</h2>
      
      <ul className={styles.list}>
        {props.items.map((item) => {
          return (
            <li key={item.url}>
              <Card
                {...propsProperty(item)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

Thus the CSS would look like this.

```css
// src/components/category/styles.module.css
.container {
  margin-bottom: 2rem;
}

.list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
  margin: 0;
}

@media (min-width: 768px) {
  .list {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

As for the `Card`, remove the left padding to align with the category title, and only add padding-left on hover to provide a slight effect. We only need to edit the link class.

```css
// src/components/card/styles.module.css
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
```

# 3. Post Detail Page

## 3.1. Container Layout

Let's edit `styles.module.css` located in the `/pages/posts/[category]/[slug].tsx` directory.

We will give a wrapper class to the position where the post content will go and style it. The class name will simply be `content`.

```tsx
// src/pages/posts/[category]/[slug].tsx
function PostPage({
  post
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className={styles.pagewrapper}>
      <article className={styles.container}>
        <h1>{post.title}</h1>
        <time>{post.date}</time>
        <ul>
          {post.tags.map((tag: string) => <li key={tag}>{tag}</li>)}
        </ul>
        {'code' in post.body ?
        {/* wrapper class for post */}
          <div className={styles.content}>
            <MDXComponent code={post.body.code} />
          </div>
          :
          <div 
            className={styles.content} 
            dangerouslySetInnerHTML={{ __html: post.body.html }} 
          />
        }
      </article>
    </main>
  );
}
```

For example, if we want to style the h1 tag within the post, we can apply styles to the selector `.content h1`. It seems to become clear why CSS in JS has become popular compared to using styled-components now.

Let's tidy up the folder structure a bit. First, let’s separate the `[slug].tsx` file into its own folder. Create a folder `pages/posts/[category]/[slug]` and within it create `index.tsx` and `styles.module.css`, then move the content from the original `[slug].tsx` into the newly created `index.tsx`.

Next, let's separate the CSS related to the post content into a different CSS module file. In the `pages/posts/[category]/[slug]`, create `content.module.css` and create a `.content` class. The current folder `[slug]` will have `index.tsx`, `styles.module.css`, and `content.module.css`, with the contents being as follows. The `getStaticPaths, getStaticProps` are omitted since they have been explained in previous posts.

```tsx
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useMDXComponent } from 'next-contentlayer/hooks';

import { getSortedPosts } from '@/utils/post';

import contentStyles from './content.module.css';
import styles from './styles.module.css';

interface MDXProps {
  code: string;
}

function MDXComponent(props: MDXProps) {
  const MDX = useMDXComponent(props.code);
  return <MDX />;
}

function PostPage({
  post
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className={styles.page}>
      <article className={styles.container}>
        <h1>{post.title}</h1>
        <time>{post.date}</time>
        <ul>
          {post.tags.map((tag: string) => <li key={tag}>{tag}</li>)}
        </ul>
        {'code' in post.body ?
          <div className={contentStyles.content}>
            <MDXComponent code={post.body.code} />
          </div>
          :
          <div
            className={contentStyles.content} 
            dangerouslySetInnerHTML={{ __html: post.body.html }} 
          />
        }
      </article>
    </main>
  );
}

export default PostPage;
```

`content.module.css`

```css
// src/pages/posts/[category]/[slug]/content.module.css
.content {
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
}
```

`styles.module.css`

```css
// src/pages/posts/[category]/[slug]/styles.module.css
.page {
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
}

.container {
  width: 92%;
  /*max-width: calc(100% - 48px);*/
  margin: 0 auto;
}

@media (min-width: 768px) {
  .page {
    max-width: 50rem;
  }
}
```

## 3.2. Post Content Layout

Now let’s create child selectors in the `content` class by editing `src/pages/posts/[category]/[slug]/content.module.css`.

There is a great reference to follow, which is the previously used [gatsby-starter-lavender](https://gatsby-starter-lavender.vercel.app/). Let's adopt everything from here.

```css
// src/pages/posts/[category]/[slug]/content.module.css
.content {
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  word-break: keep-all;
}

.content h1 {
  margin: 2rem 0 1.25rem 0;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--gray5);
  font-weight: 600;
}

.content h1 a {
  border-bottom: none;
}

.content h2 {
  margin: 1.5rem 0 1rem 0;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--gray5);
}

.content h2 a {
  border-bottom: none;
}

.content a {
  border-bottom: 1px solid var(--indigo7);
  color: var(--indigo7);
}

.content pre code {
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: break-word;
}

/* Options for merging dots */
.content :is(pre, code) {
  font-variant-ligatures: none;
}
```

To make the code look nice, let’s apply the rehype plugin in `contentlayer.config.js` as follows.

```js
// contentlayer.config.js
const rehypePrettyCodeOptions = {
  theme: 'github-light',
};

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [MDXPost, Post],
  markdown: {
    remarkPlugins: [remarkGfm, changeImageSrc],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
  mdx: {
    remarkPlugins: [remarkGfm, changeImageSrc],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], highlight],
  },
});
```

Still, the code font keeps showing as monospace. Therefore, go to `content.styles.css` and provide a new `font-family` for `.content :is(pre, code)`.

Then, to set the background for the code block and more, add the following styles in the `content.module.css`.

```css
// src/pages/posts/[category]/[slug]/content.module.css

.content pre code {
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: break-word;
}

/* Options for merging dots */
.content :is(pre, code) {
  font-family: monospace, Pretendard, apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-variant-ligatures: none;
  font-size: 1rem;
  overflow: auto;
}

.content pre {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--gray1);
  line-height: 1.5;
}

.content :not(pre) > code {
  padding: 0.25rem;
  border-radius: 0.25rem;
  background-color: var(--indigo0);
  color: var(--indigo9);
}

.content img {
  display: block;
  margin: 0 auto;
  max-width: 92%;
}

.content blockquote {
  border-left: 2px solid var(--gray5);
  padding-left: 1rem;
  color: var(--gray7);
}

.content p {
  line-height: 1.625;
  margin-bottom: 1.25rem;
}

.content p code {
  white-space: pre-wrap;
}

.content hr {
  border: 0;
  border-top: 1px solid var(--gray5);
  margin: 0.5rem 0;
}
```

To avoid having margins on both sides growing too narrow when the screen width becomes too small, let's set a max-width to keep the overall width less than 48px. (Taking reference from [Toss Blog](https://toss.tech/tech))

```css
// src/pages/posts/[category]/[slug]/styles.module.css
.container {
  width: 92%;
  // Adding this
  max-width: calc(100% - 48px);
  margin: 0 auto;
}
```

## 3.3. Title and Tags of the Post

Now we can see the post content properly. However, the title, posted date, and tags are still displayed in their default styles. Let's provide suitable styles for these elements.

Add classes to the respective elements in `PostPage` located at `src/pages/posts/[category]/[slug]/index.tsx`. Date formatting will be added as well.

```tsx
function PostPage({
  post
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const dateObj = new Date(post.date);
  // Add SEO information
  const SEOInfo: NextSeoProps = {
    title: post.title,
    description: post.description,
    canonical: `${SEOConfig.canonical}${post.url}`,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [
        {
          url: '/witch.jpeg',
          alt: `${blogConfig.name} profile picture`,
        },
      ],
      url: `${SEOConfig.canonical}${post.url}`,
    }
  };

  return (
    <main className={styles.page}>
      <NextSeo {...SEOInfo} />
      <article className={styles.container}>
        <h1 className={styles.title}>{post.title}</h1>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj)}
        </time>
        <ul className={styles.tagList}>
          {post.tags.map((tag: string)=>
            <li key={tag} className={styles.tag}>{tag}</li>
          )}
        </ul>
        <TableOfContents nodes={post._raw.headingTree} />
        {'code' in post.body ?
          <div className={contentStyles.content}>
            <MDXComponent code={post.body.code} />
          </div>
          :
          <div
            className={contentStyles.content} 
            dangerouslySetInnerHTML={{ __html: post.body.html }} 
          />
        }
      </article>
    </main>
  );
}
```

And the styling for each element will be as follows. Add margin to the container class to create space between the header and the post section, while the `page` class can remain as is.

```css
// src/pages/posts/[category]/[slug]/styles.module.css
.container {
  width: 92%;
  max-width: calc(100% - 48px);
  margin: 0 auto;
  margin-top: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.time {
  display: block;
  font-size: 1.25rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.tagList {
  list-style: none;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 10px;
}

.tag {
  background-color: var(--indigo1);
  color: var(--indigo8);
  padding: 5px;
  border-radius: 5px;
}
```

# 4. Back to Post List Page

After creating the global CSS, I hadn't touched the post list page, but there are a few spacing issues appearing that need to be fixed.

## 4.1. Change the Way Topics are Retrieved

Currently, when entering the post list page, the topic display doesn’t show `dev`, `misc`, but has changed to `개발`, `기타`, which has not been applied yet.

This can be fixed by modifying `getStaticProps` in `src/pages/posts/[category]/index.tsx`. We will change the way the `category` is obtained so that it reflects the actual topic name.

```tsx
/*
Modify getStaticProps in
src/pages/posts/[category]/index.tsx
*/
export const getStaticProps: GetStaticProps = ({params}) => {
  const allDocumentsInCategory = getSortedPosts().filter((post)=>
    post._raw.flattenedPath.startsWith(params?.category as string
    ));
  // Changed how category is obtained.
  const category = blogCategoryList.find((c)=>
    c.url.split('/').pop() === params?.category)?.title;

  const postList = allDocumentsInCategory.map((post) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  return { props: { category, postList } };
};
```

## 4.2. Style Adjustments

Now let’s modify `src/pages/posts/[category]/styles.module.css`. We'll create a new title class and add some spacing to the container.

```css
.page {
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
}

.container {
  width: 92%;
  max-width: calc(100% - 48px);
  margin: 0 auto;
  margin-top: 2rem;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .page {
    max-width: 60rem;
  }

  .title {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
}
```

There’s still more to do, but since I have many other tasks ahead, I will stop the modifications for the post list page here.

# 5. Creating a Table of Contents (TOC)

TOC stands for Table of Contents, which represents the outline of the article. Let's create one manually, where headings from h1 to h6 in the markdown file will be parsed to generate the TOC.

## 5.1. Assigning IDs to Headings

First, we need to extract all headings from the markdown file and assign IDs to them. This can be done using the previously installed `unist-util-visit`. Let’s create a custom remark plugin for this as well, referencing [this article](https://claritydev.net/blog/nextjs-blog-remark-interactive-table-of-contents).

Create `src/plugins/heading-tree.mjs` and write the following content.

The basic code for visiting h1 to h6 in the AST looks like this. For now, it simply outputs the heading nodes.

```js
// src/plugins/heading-tree.mjs
import { visit } from 'unist-util-visit';

function getHeadings(tree) {
  visit(tree, 'heading', (node) => {
    console.log(node);
  });
}

export default function headingTree() {
  return (tree, file) => {
    getHeadings(tree);
  };
}
```

We can see that the heading nodes are outputting correctly. Now let's add IDs to each heading. First, we will create an `addID` function that will iterate through the mdast and add IDs to each heading element.

```js
// src/plugins/heading-tree.mjs
function addID(node, headings) {
  const id = node.children.map(c => c.value).join('');
  headings[id] = (headings[id] || 0) + 1;
  node.data = node.data || {
    hProperties: {
      title: id,
      // Adding id is necessary in case of having multiple headings with the same title
      id: `${id}${(headings[id] > 1 ? `-${headings[id]}` : '')}`
        .split(' ')
        .join('-')
    }
  };
}
```

We utilize a `headings` object to track duplicates to prevent issues stemming from the possibility of multiple headings with the same title. Though it's rare, it’s a good precaution.

Also, we set both title and id in `node.data` under `hProperties`, as this is how properties must be set in heading elements. It is necessary that this is named `hProperties`, as that’s the required term when defining properties in HTML AST (hast) elements. Refer to [hast Github](https://github.com/syntax-tree/mdast-util-to-hast#hproperties).

## 5.2. Creating Heading Hierarchy

Next, we need to establish a hierarchical structure for the headings. There are h1 to h6 headings, and typically when using TOC, these headings have hierarchical relations.

For instance, if the headings are structured like this, it's natural to consider encapsulation, inheritance, and polymorphism headings as belonging under the "Characteristics of Object-Oriented Programming" heading.

```
# 1. Characteristics of Object-Oriented Programming
## 1.1. Encapsulation
## 1.2. Inheritance
## 1.3. Polymorphism
```

To implement this, we will create a function `makeHeadingTree`.

```js
// src/plugins/heading-tree.mjs
function makeHeadingTree(node, output, depthMap) {
  const newNode = {
    data: node.data,
    depth: node.depth,
    children: [],
  };
  /* h1 will have no parent, thus push it directly to the headingTree output */
  if (node.depth === 1) {
    output.push(newNode);
    depthMap[node.depth] = newNode;
  } else {
    /* Using DFS, the most recently visited node with depth one less than the current node becomes the parent */
    const parent = depthMap[node.depth - 1];
    if (parent) {
      parent.children.push(newNode);
      /* Update the most recently visited node at this depth */
      depthMap[node.depth] = newNode;
    }
  }
}
```

## 5.3. Passing Data

Now, let's rename the earlier `getHeading` function to `handleHeading`, and incorporate the ID assignment and heading tree construction features as it iterates through heading elements.

```js
// src/plugins/heading-tree.mjs
function handleHeading(tree) {
  const headings = {};
  const output = [];
  const depthMap = {};
  visit(tree, 'heading', (node) => {
    addID(node, headings);
    makeHeadingTree(node, output, depthMap);
    //console.log(node);
  });
  return output;
}
```

The `handleHeading` function will return the hierarchically structured headings. Now, how do we pass this to the converted files by contentlayer?

After examining console logs, we found that the `file` in the `tree, file` arguments received by the plugin's function contains `file.data.rawDocumentData`, which is transferred to the `_raw` property of the JSON files in `contentlayer/generated`.

Therefore, we will append the heading tree we created to `file.data.rawDocumentData` in the final plugin function `headingTree`.

```js
// src/plugins/heading-tree.mjs
export default function headingTree() {
  return (tree, file) => {
    file.data.rawDocumentData.headingTree = handleHeading(tree);
  };
}
```

Next, we will add the `headingTree` plugin to `contentlayer.config.ts`.

```ts
export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [MDXPost, Post],
  markdown: {
    /* added headingTree plugin! */
    remarkPlugins: [remarkGfm, changeImageSrc, headingTree],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
  mdx: {
    remarkPlugins: [remarkGfm, changeImageSrc, headingTree],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], highlight],
  },
});
```

With this done, execute `npm run dev`, then navigate to `contentlayer/generated` and view a markdown file to find that the `_raw` property now contains the `headingTree` correctly structured inside.

## 5.4. Creating the TOC

With the hierarchical structure of the heading tree established, we can utilize the post conversion data found in `getStaticProps` of the `src/pages/[category]/[slug]/index.tsx`. We can access the heading tree through `post._raw.headingTree`.

Now, let’s create the component that will render it. Create a `src/components/toc` folder containing `index.tsx` and `styles.module.css`.

First, we will create a type for each node in the heading tree, noting that this is a recursive structure.

```tsx
interface ContentType {
  data: {
    hProperties: {
      id: string;
      title: string;
    }
  };
  depth: number;
  children: ContentType[];
}
```

Next, we assume there’s a function `renderContent` that recursively renders the heading tree, and we will write the TOC component structure.

```tsx
function TableOfContents({ nodes }: { nodes: ContentType[] }) {
  if (!nodes.length) return null;
  return (
    <section>
      <span>Table of Contents</span>
      {renderContent(nodes)}
    </section>
  );
}

export default TableOfContents;
```

The `renderContent` function will render the heading tree recursively within a `<ul>` element.

```tsx
function renderContent(nodes: ContentType[]) {
  return (
    <ul>
      {nodes.map((node: ContentType) => (
        <li key={node.data.hProperties.id}>
          <a href={`#${node.data.hProperties.id}`}>{node.data.hProperties.title}</a>
          {node.children.length > 0 && renderContent(node.children)}
        </li>
      ))}
    </ul>
  );
}
```

Finally, place the TOC component in an appropriate position within the `PostPage` of `src/pages/[category]/[slug]/index.tsx` as follows:

```tsx
<TableOfContents nodes={post._raw.headingTree} />
```

![toc-layout](./toc-layout.png)

## 5.5. Smooth Scrolling and Styling

Currently, clicking on a TOC element scrolls to the respective heading without any smooth transition. Let's implement a smooth scrolling effect along with some simple styling.

The smooth scrolling is easy to implement. Just modify the `scroll-behavior` property in global CSS.

```css
// src/styles/globals.css
html, body {
  min-height: 100vh;
  scroll-behavior: smooth;
}
```

Next, we will add the following classes to the TOC component.

```tsx
function renderContent(nodes: ContentType[]) {
  return (
    <ul className={`${styles.list} ${nodes[0].depth - 1 ? '' : styles.list__h1}`}>
      {nodes.map((node: ContentType) => (
        <li key={node.data.hProperties.id} className={styles.item}>
          <a
            className={styles.link}
            href={`#${node.data.hProperties.id}`}
          >
            {node.data.hProperties.title}
          </a>
          {node.children.length > 0 && renderContent(node.children)}
        </li>
      ))}
    </ul>
  );
}

function TableOfContents({ nodes }: { nodes: ContentType[] }) {
  if (!nodes.length) return null;
  return (
    <section>
      <span className={styles.title}>Table of Contents</span>
      {renderContent(nodes)}
    </section>
  );
}
```

The styles for each class will look like this.

```css
.title {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.list {
  list-style: none;
  margin-left: 1.5rem;
  font-size: 0.875rem;
}

.list__h1 {
  margin-left: 0;
}

.item {
  margin: 0;
}

.link {
  color: var(--gray7);
  line-height: 1.75;
  text-decoration: underline;
}

.link:hover {
  color: var(--indigo6);
}
```

## 5.6. Scroll Position Issue

Currently, when navigating through the TOC, the headings scroll to the very top of the page, which means they can get obscured by the fixed header at the top of the page.

To solve this, we can use the CSS property `scroll-margin`.

Add the following for heading elements in `src/pages/posts/[category]/[slug]/content.module.css`.

```css
/* Add to src/pages/posts/[category]/[slug]/content.module.css */
.content :is(h1, h2, h3, h4, h5, h6) {
  scroll-margin-top: 50px;
}
```

## 5.7. Indicate Progress in the Article

The TOC is currently placed at the top of the article content, but it would be better if the TOC were always displayed to the right of the content as the screen width increases. Let’s implement this.

This will be done using the `Intersection Observer API`, which will be performed asynchronously and thus will not load the scroll events and be more efficient.

Of course, we need to edit the `src/components/toc/index.tsx`. First, let’s separate the link component used in the TOC into its own `TOCLink` component.

Create a folder called `src/components/toc/tocLink` and inside create `index.tsx` and `styles.module.css`.

In `index.tsx`, we simply replicate the basic structure used within the TOC links.

```tsx
// src/components/toc/tocLink/index.tsx
function TOCLink({ node }: { node: ContentType }) {
  return (
    <a
      className={styles.link}
      href={`#${node.data.hProperties.id}`}
    >
      {node.data.hProperties.title}
    </a>
  );
}
```

Next, let’s create a `useHighlight` hook that returns which heading ID is currently active based on scrolling. Using `useEffect`, it creates an `IntersectionObserver` when the hook renders and monitors changes to the heading elements. The hook returns the ID of the activated heading and a function to set the activated heading ID.

```tsx
// src/components/toc/tocLink/index.tsx
function useHighLight(): [string, Dispatch<SetStateAction<string>>] {
  const observer = useRef<IntersectionObserver>();
  const [activeID, setActiveID] = useState<string>('');

  useEffect(() => {
    // Callback executed when changes occur
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveID(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px -40% 0px',
    });

    const elements = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    elements.forEach((element) => observer.current?.observe(element));
    return () => observer.current?.disconnect();
  }, []);

  return [activeID, setActiveID];
}
```

In the `TOCLink` component, use this hook to get the active heading’s ID, then check whether it matches the link’s ID for applying the active style.

```tsx
// src/components/toc/tocLink/index.tsx
function TOCLink({ node }: { node: ContentType }) {
  const id = node.data.hProperties.id;
  const [activeID, setActiveID] = useHighLight();
  return (
    <a
      className={`${styles.link} ${activeID === id ? styles.link__active : ''}`}
      href={`#${node.data.hProperties.id}`}
      onClick={() => setActiveID(id)}
    >
      {node.data.hProperties.title}
    </a>
  );
}
```

The styles for TOCLink will be:

```css
// src/components/toc/tocLink/styles.module.css
.link {
  color: var(--gray7);
  line-height: 1.75;
  text-decoration: underline;
}

.link:hover {
  color: var(--indigo6);
}

.link__active {
  background-color: var(--indigo1);
  color: var(--indigo8);
  padding: 3px;
  border-radius: 5px;
}

.link__active:hover {
  background-color: var(--indigo2);
}
```

With this setup, the TOC becomes reactive to scrolling. However, the issue remains that it’s currently at the very top of the content, which means we can’t see the TOC moving along with the scroll.

Thus, when there is sufficient screen width, let’s ensure the TOC stays fixed to the right side of the content area.

This can be achieved by applying a fixed position to the container class enclosing the TOC, along with adequate margins.

```css
// src/components/toc/styles.module.css
@media (min-width: 1280px) {
  .container {
    position: fixed;
    top: 50px;
    left: calc(50% + 25rem);
    margin-top: 2rem;
  }
}
```

The left margin is calculated using the `calc` function as the content area width is capped at 50rem at widths larger than 1280px. Therefore, this ensures the TOC will be accurately fixed relative to the content area.

# 6. Changing Favicon (+ SEO)

Do you recall how we filled the `Head` tag with various meta-information on the main page some time ago? It included the title and much more.

```tsx
// src/pages/index.tsx
<Head>
  <title>{blogConfig.title}</title>
  <meta name='description' content={blogConfig.description} />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <meta name='og:image' content={blogConfig.thumbnail} />
  <meta name='twitter:image' content={blogConfig.thumbnail} />
  <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
  <link rel='icon' href='/witch-hat.svg' />
  <link rel='manifest' href='/site.webmanifest' />
  <link rel='canonical' href='https://witch.work/' />
</Head>
```

Now it's time to enhance the SEO and update the favicon with the previously found SVG witch hat.

## 6.1. Installing next-seo

Earlier we inserted metadata using the next Head element. However, using next-seo simplifies the process. Let’s install it.

```bash
npm install next-seo
```

Next, we will create a configuration object for SEO in `blog-config.ts`.

```ts
// /blog-config.ts
export const SEOConfig: NextSeoProps = {
  title: blogConfig.title,
  description: blogConfig.description,
  canonical: blogConfig.url,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: blogConfig.title,
    description: blogConfig.description,
    url: blogConfig.url,
    siteName: blogConfig.title,
    images: [
      {
        url: '/witch.jpeg',
        alt: `${blogConfig.name} profile picture`,
      },
    ],
  },
};
```

This will be applied in `src/pages/_app.tsx` using the `DefaultSeo` component.

```tsx
// src/pages/_app.tsx
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...SEOConfig} />
      <Header navList={blogCategoryList} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
```

Now let’s handle SEO for each post. Using the `NextSeo` component makes it easy. First, let's handle the individual post pages.

```tsx
// src/pages/posts/[category]/[slug]/index.tsx
function PostPage({
  post
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const dateObj = new Date(post.date);
  // Add SEO information
  const SEOInfo: NextSeoProps = {
    title: post.title,
    description: post.description,
    canonical: `${SEOConfig.canonical}${post.url}`,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [
        {
          url: '/witch.jpeg',
          alt: `${blogConfig.name} profile picture`,
        },
      ],
      url: `${SEOConfig.canonical}${post.url}`,
    }
  };

  return (
    <main className={styles.page}>
      <NextSeo {...SEOInfo} />
      <article className={styles.container}>
        <h1 className={styles.title}>{post.title}</h1>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj)}
        </time>
        <ul className={styles.tagList}>
          {post.tags.map((tag: string) =>
            <li key={tag} className={styles.tag}>{tag}</li>
          )}
        </ul>
        <TableOfContents nodes={post._raw.headingTree} />
        {'code' in post.body ?
          <div className={contentStyles.content}>
            <MDXComponent code={post.body.code} />
          </div>
          :
          <div
            className={contentStyles.content}
            dangerouslySetInnerHTML={{ __html: post.body.html }}
          />
        }
      </article>
    </main>
  );
}
```

Similarly, for the `PostListPage`, we will add relevant SEO.

```tsx
// src/pages/posts/[category]/index.tsx
const SEOInfo: NextSeoProps = {
  title: `${category} Topic Posts`,
  description: `${category} Topic Post Collection Page`,
  openGraph: {
    title: `${category} Topic Posts`,
    description: `${category} Topic Post Collection Page`,
    images: [
      {
        url: '/witch.jpeg',
        alt: `${blogConfig.name} profile picture`,
      },
    ],
  }
};
// Add this component inside the PostListPage
<NextSeo {...SEOInfo} />
```

## 6.2. Installing next-sitemap

Let’s also set up the site map automatically by using `next-sitemap`. First, install the package.

```bash
npm i next-sitemap
```

Then, create a config file. Create `next-sitemap.config.js` in the root directory and write the following:

```js
/** @type {import('next-sitemap').IConfig} */

module.exports = {
  // My blog apex URL
  siteUrl: process.env.SITE_URL || 'https://witch.work',
  generateRobotsTxt: true, // (optional)
  // ...other options
};
```

Now, we will modify the `postbuild` command to generate the sitemap after the build is fully finished.

```json
// package.json
"scripts": {
  "copyimages": "node ./src/bin/pre-build.mjs",
  "prebuild": "npm run copyimages",
  // Add this
  "postbuild": "next-sitemap",
  "predev": "npm run copyimages",
  "dev": "next dev",
  "build": "contentlayer build && next build",
  "start": "next start",
  "lint": "next lint"
},
```

Now, running `npm run build` will generate the `sitemap.xml` in the `public` folder. It will also automatically create a `robots.txt`.

## 6.3. Changing the Favicon

To change the favicon, we can amend the default SEO config. In `src/blog-config.ts`, add `additionalLinkTags`.

```ts
// blog-config.ts
export const SEOConfig: NextSeoProps = {
  title: blogConfig.title,
  description: blogConfig.description,
  canonical: blogConfig.url,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: blogConfig.title,
    description: blogConfig.description,
    url: blogConfig.url,
    siteName: blogConfig.title,
    images: [
      {
        url: blogConfig.picture,
        alt: `${blogConfig.name} profile picture`,
      },
    ],
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/witch-hat.svg',
    },
    {
      rel: 'mask-icon',
      href: '/witch-hat.svg',
      color: '#000000'
    },
    {
      rel: 'apple-touch-icon',
      href: '/witch-hat.png',
    }
  ]
};
```

While at it, let’s remove the Head tag from main page. But is there anything that should be left? After checking against what’s being handled by next-seo, we can leave the following content.

```tsx
// Remaining head tag in src/pages/index.tsx
<Head>
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <link rel='manifest' href='/site.webmanifest' />
</Head>
```

As both the viewport setting and the manifest should apply to all pages, let’s move them from `pages/index.tsx` to the universal `_app.tsx` as below.

```tsx
// src/pages/_app.tsx
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <DefaultSeo {...SEOConfig} />
      <Header navList={blogCategoryList} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
```

## 6.4. Issue with KakaoTalk Previews

However, one problem has arisen. Sending links to specific post pages provides proper previews, while sending links to the main page or post list page does not.

![kakao-problem](./kakao-preview-prob.jpeg)

Since KakaoTalk uses the `og:image` for parsing, I checked and confirmed those elements are present within the head. It seems like it fails to retrieve that image.

Is the image actually available? The image used as a preview for all pages is `/witch.jpeg`. Checking at [this link](https://witch-next-blog.vercel.app/witch.jpeg), I can see that the image is indeed present with the deployment.

Thus, let’s convert the URLs for the images pulled in `NextSeo` and `DefaultSeo`. First, modify the `blog-config.ts` SEOConfig to update its image URL.

```ts
// blog-config.ts
export const SEOConfig: NextSeoProps = {
  /* omitted */
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: blogConfig.title,
    description: blogConfig.description,
    url: blogConfig.url,
    siteName: blogConfig.title,
    images: [
      {
        // Now using the blog URL concatenated with the image path
        url: `${blogConfig.url}${blogConfig.thumbnail}`,
        alt: `${blogConfig.name} profile picture`,
      },
    ],
  },
  /* omitted */
}
```

Now, update the `og:image` URL on main and post list pages as well.

The `NextSeo` property for the post list page should also have the `og:url`.

Going ahead, we will edit `getStaticProps` to retrieve the post list URLs.

```tsx
export const getStaticProps: GetStaticProps = ({ params }) => {
  const allDocumentsInCategory = getSortedPosts().filter((post) =>
    post._raw.flattenedPath.startsWith(params?.category as string)
  );

  const { title: category, url: categoryURL } = blogCategoryList.find((c) =>
    c.url.split('/').pop() === params?.category) as { title: string, url: string };

  const postList = allDocumentsInCategory.map((post) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  return { props: { category, categoryURL, postList } };
};
```

At the same time, we can add the canonical URL.

```tsx
/* Inside src/pages/posts/[category]/index.tsx
Adjust props passed to the NextSeo component */
const SEOInfo: NextSeoProps = {
  title: `${category} Topic Posts`,
  description: `${category} Topic Post Collection Page`,
  canonical: `${blogConfig.url}${categoryURL}`,
  openGraph: {
    title: `${category} Topic Posts`,
    description: `${category} Topic Post Collection Page`,
    images: [
      {
        url: `${blogConfig.url}${blogConfig.thumbnail}`,
        alt: `${blogConfig.name} profile picture`,
      },
    ],
    url: `${blogConfig.url}${categoryURL}`,
  },
};
```

Now we can verify that the KakaoTalk previews show properly.

![kakao-solved](./kakao-preview-solved.jpeg)

# References

https://gamguma.dev/post/2022/01/nextjs-blog-development-review

Creating TOC https://claritydev.net/blog/nextjs-blog-remark-interactive-table-of-contents

https://thisyujeong.dev/blog/toc-generator

Refer to heading structure in mdast https://github.com/syntax-tree/mdast-util-to-hast#hproperties

Using is to select multiple descendant tags https://stackoverflow.com/questions/11054305/css-select-multiple-descendants-of-another-element

Code formatting https://yiyb-blog.vercel.app/posts/nextjs-contentlayer-blog

https://maintainhoon.vercel.app/blog/post/blog_development_period

Adding IDs https://github.com/syntax-tree/mdast-util-to-hast

If you'd like to write plugins in TS...
https://rokt33r.github.io/posts/contribute-definitely-typed

Using scroll-margin https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin

Refer to sites on SEO and metadata
- Referenced to change favicon https://brunch.co.kr/@ultra0034/129
- Implementing next-seo https://kyounghwan01.github.io/blog/React/next/next-seo/
- Setting up next sitemap https://vroomfan.tistory.com/51, https://bepyan.github.io/blog/nextjs-blog/5-create-sitemap
- Official next-seo documentation https://www.npmjs.com/package/next-seo

next-sitemap npm page https://www.npmjs.com/package/next-sitemap

Intersection observer 
https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API