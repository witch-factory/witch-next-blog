---
title: Creating a Blog - 12. Page Theme, Comments, Search
date: "2023-06-09T00:00:00Z"
description: "Implementing comment functionality, dark themes, and search features"
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Setup|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of the Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structural Design of the Post Detail Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enabling Relative Paths for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Minor Improvements in Page Composition and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Layout Design of Page Elements|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Designing Main Page Components|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Designing Post List/Content Page Components|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatically Generating Post Thumbnails|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements Including Font and Card Design|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding Views to Posts|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Theme and Post Search Functionality|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Enhancements to Theme Icons and Thumbnail Layouts|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Post Classification to Tags|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Main Page Optimization|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Pagination for Post Lists|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 1. Page Theme (Especially Dark Mode)

I have crossed the river of optimization. Has my blog improved? I hope so... Anyway, let's return to functionality implementation. What remains? At the moment, I think of page themes, comment functionality, and search functionality. First, let’s implement the developer's friend, dark mode.

## 1.1. Library Installation

I used the [next-themes](https://github.com/pacocoursey/next-themes) library, which simplifies theme implementation. First, install it. It is a small library of about 30KB.

```bash
npm install next-themes
```

Wrap all page components in `_app.tsx` with the `ThemeProvider` component provided by this library. There is no need to wrap the Head or SEO components.

```tsx
// src/pages/_app.tsx
export default function App({ Component, pageProps }: AppProps) {
  /* Google Analytics event trigger code omitted */
  
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <DefaultSeo {...SEOConfig} />
      <ThemeProvider>
        <Header navList={blogCategoryList} />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
      <GoogleAnalytics />
    </>
  );
}
```

## 1.2. Implementing a Toggle Button

Next, let’s implement a light-dark mode toggle button. First, let's draw an icon for the button. It was cumbersome to find images, so I crudely drew them using [excalidraw](https://excalidraw.com/).

![Light Mode Icon](./light-mode.svg)

![Dark Mode Icon](./dark-mode.svg)

The toggle button will be placed in the header, so create the folder `src/components/header/themeChanger` along with `index.tsx` and `styles.module.css`.

Referencing the [next-themes GitHub README](https://github.com/pacocoursey/next-themes), I created the themeChanger. To avoid the default system theme, I used `resolvedTheme` instead of `theme`.

```tsx
// src/components/header/themeChanger/index.tsx
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import styles from './styles.module.css';

function ThemeIcon({isDark}: {isDark: boolean}) {
  return (
    <Image 
      src={isDark ? '/dark-mode.svg' : '/light-mode.svg'}
      alt={isDark ? 'Dark mode icon' : 'Light mode icon'}
      width={50}
      height={40}
    />
  );
}

const ThemeChanger = () => {
  const [mounted, setMounted]=useState<boolean>(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button 
      onClick={toggleTheme}
      className={styles.button}
      aria-label='theme toggle button'
      aria-pressed={isDark}
    >
      <ThemeIcon isDark={isDark} />
    </button>
  );
};

export default ThemeChanger;
```

Styling for the toggle button is kept simple for now.

```css
// src/components/header/themeChanger/styles.module.css
.button{
  margin:0;
  padding:0;
  border:none;
  background:none;
}
```

Then, add this to the header.

```tsx
// src/components/header/index.tsx
function Header({
  navList
}: {
  navList: PropsItem[];
}) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <HomeButton />
          <div className={styles.wrapper}>
            <ThemeChanger />
            <Menu navList={navList} />
          </div>
        </div>
      </nav>
    </header>
  );
}
```

## 1.3. Organizing Colors

Now, let’s define various colors for dark mode in `global.css`. The colors defined in `:root` are the default theme colors, while those defined in `[data-theme='dark']` are the dark theme colors. We can skip changing fonts or layouts for now.

Let's review how the current colors are being used across the blog. All colors are referenced only by their defined variables, so we will clean this up, unify where applicable, and redefine the colors for dark mode.

Here is how the colors are currently utilized:

- **white** - Text color on hover for currently active pagination, and for header and dropdown menu colors.
- **gray1** - Background on hover for Card component, main page introduction, code block background on detail pages, and line color between date and view count on detail pages.
- **gray2** - Footer background, hover background for header buttons/links.
- **gray3** - Header border color.
- **gray5** - Border beneath headings on detail pages.
- **gray6** - Footer text color, shadow for projectCard component.
- **gray7** - Text color for Table of Contents and blockquote on detail pages.
- **indigo0** - Background for technology stacks in project introductions and small code block backgrounds on detail pages.
- **indigo1** - Background for tags in post info and pagination selected page number.
- **indigo2** - Hover background for project introduction expand button and Table of Contents current item.
- **indigo5** - Background for pagination selected page number on hover.
- **indigo6** - Colors for links in about page, hover text color for TOC links.
- **indigo7** - Text color for links within detail content.

Let’s integrate the unused variable names and unify color definitions according to their intended use.

Thus, we will add the following CSS variables to `:root` in `src/styles/globals.css`.

```css
// src/styles/globals.css
:root {
  --bgColor: #ffffff;
  --bgGray: #f1f3f5;
  --bgGrayHover: #e9ecef;
  --headerBorderColor: #dee2e6;
  --borderGray: #adb5bd;
  --shadowGray:#868e96;
  --textGray:#495057;

  --codeBlockBgColor:#edf2ff;
  --bgIndigo:#dbe4ff;
  --bgIndigoHover:#bac8ff;
  --textLightIndigo:#4c6ef5;
  --linkColor:#4263eb;
  --textIndigo:#3b5bdb;
  --codeBlockTextColor:#364fc7;
}
```

Next, we'll define the colors for dark mode in `[data-theme='dark']`. The tags’ indigo colors were taken from the [color-hex Indigo palette 2](https://www.color-hex.com/color-palette/2793).

When determining colors, readability and the purpose of the original components were prioritized over similarity to existing colors. For instance, less attention-grabbing colors were chosen for backgrounds containing tags or technology stacks.

```css
// src/styles/globals.css
[data-theme='dark'] {
  --bgColor: #212529;
  --textColor: #ececec;

  --bgGray: #343a40;
  --bgGrayHover:#343a40;
  --headerBorderColor:#495057;
  --borderGray: #868e96;
  --shadowGray:#868e96;
  --textGray:#ced4da;

  --codeBlockBgColor:#343a40;
  --codeBlockTextColor:#edf2ff;
  --bgIndigo:#002395;
  --bgIndigoHover:#2b4aaf;
  --textIndigo:#edf2ff;
  --textLightIndigo:#748ffc;
  --linkColor:#91a7ff;
}
```

Additionally, font colors and background colors for `html` and `body` will be set using CSS variables.

```css
// src/styles/globals.css
html, body {
  min-height:100vh;
  scroll-behavior: smooth;
  background-color:var(--bgColor);
  color:var(--textColor);
}
```

## 1.4. Changing Code Theme

However, the issue is that even when switching to dark mode, the code remains styled with light theme colors. This can be solved by providing options to the rehype plugin in `contentlayer.config.js`.

```js
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
};
```

Unfortunately, this will result in both light and dark themed code blocks being displayed. To prevent this, we should hide any `pre` tags with a `data-theme` attribute that is not the same as the current `data-theme`. Add the following CSS to `src/styles/globals.css`.

```css
[data-theme='dark'] pre[data-theme='light']{
  display:none;
}

[data-theme='light'] pre[data-theme='dark']{
  display:none;
}
/* To follow the system's theme */
@media (prefers-color-scheme: dark){
  html {
    data-theme:dark;
  }
}
```

# 2. Creating a Custom Theme

I currently use the [Light Pink Theme](https://marketplace.visualstudio.com/items?itemName=mgwg.light-pink-theme) in VSCode, which lacks popularity. However, if I can similarly apply it to the blog, it could be more refreshing than conventional light/dark themes.

Customizing code blocks will likely be challenging, but let's give it a try. Color choices are sourced from [Open Color’s Pink](https://yeun.github.io/open-color/#pink), [DaisyUI’s Valentine theme colors](https://github.com/saadeghi/daisyui/blob/master/src/theming/themes.js), and the [Light Pink Theme’s color JSON](https://github.com/mgwg/light-pink-theme/blob/master/themes/Light%20Pink-color-theme.json).

## 2.1. Creating a Color Switch Button

Since this is experimental, let's place it in the footer for now.

```tsx
// src/components/footer/index.tsx
function Footer() {
  const { setTheme } = useTheme();

  const pinkTheme = () => {
    setTheme('pink');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <p className={styles.copyright}>
          © {blogConfig.name}, Built with
            <Link href='https://github.com/witch-factory/witch-next-blog' target='_blank'> witch-next-blog</Link>, 
          2023
          </p>
          <Link href='https://github.com/witch-factory' className={styles.github}>
            <Image src='/github-mark.png' alt='Github' width={32} height={32} />
          </Link>
          <div className={styles.theme}>
            <p>Experimental Color Theme Changer</p>
            <button 
              className={styles.pinkTheme}
              onClick={pinkTheme}
            ></button>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

Add styles for the footer.

```css
/* src/components/footer/styles.module.css */
.theme{
  padding-bottom:20px;
}

.pinkTheme{
  height:40px;
  width:40px;
  background-color:var(--pink);
  border:none;
  border-radius:50%;
}
```

## 2.2. Adding the Theme

The `pink` theme also needs to be added to the `ThemeProvider`.

```tsx
// src/pages/_app.tsx
export default function App({ Component, pageProps }: AppProps) {
  /* Google Analytics event code omitted */
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <DefaultSeo {...SEOConfig} />
      {/* The attribute(data-theme) changes its value based on the theme */}
      <ThemeProvider
        defaultTheme='system'
        enableSystem={true}
        value={{ dark: 'dark', light: 'light', pink: 'pink' }}
        themes={['dark', 'light', 'pink']}
      >
        <Header navList={blogCategoryList} />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
      <GoogleAnalytics />
    </>
  );
}
```

Next, add the color variable values in `globals.css`.

```css
// src/styles/globals.css
[data-theme='pink'] {
  --bgColor: #f5f0f3;
  --textColor: #632c3b;

  --bgGray: #f5e3ef;
  --bgGrayHover:#f5e3ef;
  --headerBorderColor:#ffdeeb;
  --borderGray: #af4670;
  --shadowGray:#868e96;
  --textGray:#d6336c;
  
  --codeBlockBgColor:#ffdeeb;
  --codeBlockTextColor:#a61e4d;
  --bgIndigo:#ffdeeb;
  --bgIndigoHover:#fcc2d7;
  --textIndigo:#c2255c;
  --textLightIndigo:#f06595;
  --linkColor:#d6336c;
}
```

We also need to provide options for rehype plugins regarding the pink theme in `contentlayer.config.js`.

```js
// contentlayer.config.js
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    pink: 'light-plus',
    dark: 'github-dark',
  },
};
```

Add CSS to exclude DOM `pre` tags with themes that differ from the current one.

```css
// src/styles/globals.css
[data-theme='dark'] pre:not([data-theme='dark']){
  display:none;
}

[data-theme='light'] pre:not([data-theme='light']){
  display:none;
}

[data-theme='pink'] pre:not([data-theme='pink']){
  display:none;
}
```

Now, clicking the pink circle under `Experimental Color Theme Changer` in the footer will apply the pink theme.

In the future, I wish to add more themes to allow for multiple options. However, since defining color variables and code themes will cover a lot of ground, this will be done after the addition of other features.

# 3. Comment Functionality

Let's create the comment functionality. This will be provided by the giscus library.

First, install the [giscus](https://github.com/apps/giscus) app via GitHub. I installed it to my blog repository exclusively. Then, go to the Settings of the blog repository and [enable discussions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository).

Next, follow the instructions in the [official documentation guide](https://giscus.app/) and suitably adjust it for my blog.

## 3.1. giscus Information Config

Add the giscus configuration to `blog-config.ts`.

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
  thumbnail: string;
  googleAnalyticsId?: string; // gtag id
}

const blogConfig: BlogConfigType = {
  name:'Sung Hyun Kim',
  title:'Witch-Work',
  description:
    'I am not a person with extraordinary intentions. ' +
    'I arrived here while following the light of amazing people, and I hope to live this way in the future. ' +
    'It is an honor to share this place with you who visited.',
  picture:'/witch.jpeg',
  url:'https://witch.work',
  social: {
    Github: 'https://github.com/witch-factory',
    BOJ: 'https://www.acmicpc.net/user/city'
  },
  /* Adding the comment object. */
  comment: {
    type: 'giscus',
    repo: 'witch-factory/witch-next-blog',
    repoId: 'R_kgDOJnEDaQ',
    category: 'General',
    categoryId: 'DIC_kwDOJnEDac4CXFDt',
  },
  thumbnail: '/witch.jpeg',
  googleAnalyticsId:'G-HBQKJEYL1K'
};
```

## 3.2. giscus Component

Create a component to display the comments. Create a folder `src/components/giscus/` and, as before, create `index.tsx`.

Since messages will frequently be sent via giscus, I will create the function for that action.

```tsx
const sendMessage = (message: Record<string, unknown>) => {
  const iframe: HTMLIFrameElement | null = document.querySelector(
    'iframe.giscus-frame',
  );
  iframe?.contentWindow?.postMessage({ giscus: message }, 'https://giscus.app');
};
```

Using `useEffect`, I’ll implement the Giscus component by rendering a script tag into the returned div component so that the iframe renders inside it. Additionally, upon theme changes and page navigations, we will update the messages through the `sendMessage` function.

```tsx
// src/components/giscus/index.tsx
function Giscus() {
  const ref=createRef<HTMLDivElement>();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme ?? 'dark';
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    if (blogConfig.comment?.type !== 'giscus') {
      return;
    }
    const config = {
      'data-repo': blogConfig.comment.repo,
      'data-repo-id': blogConfig.comment.repoId,
      'data-category': blogConfig.comment.category,
      'data-category-id': blogConfig.comment.categoryId,
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': theme,
      'data-lang': blogConfig.comment.lang ?? 'en',
      'data-loading': blogConfig.comment.lazy ? 'lazy' : undefined,
      src: 'https://giscus.app/client.js',
      crossOrigin: 'anonymous',
      async: true,
    };

    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, `${value}`);
    });
    /* Clean up any existing children */
    ref.current?.childNodes.forEach((children) => {
      ref.current?.removeChild(children);
    });

    ref.current?.appendChild(script);

    return () => {
      ref.current?.childNodes.forEach((children) => {
        ref.current?.removeChild(children);
      });
    };
  }, []);

  useEffect(() => {
    sendMessage({
      setConfig: {
        theme: theme,
      },
    });
  }, [theme]);

  useEffect(() => {
    sendMessage({ setConfig: { term: router.asPath } });
  }, [router.asPath]);

  if (blogConfig.comment?.type !== 'giscus') {
    return null;
  }
  return (
    <div className='giscus' ref={ref} />
  );
}
```

Add this component to `src/pages/posts/[category]/[slug]/index.tsx`. While at it, let’s wrap the meta information displaying part into a new component.

```tsx
// src/pages/posts/[category]/[slug]/index.tsx
interface PostMatter{
  title: string;
  date: string;
  SWRfallback: {[key: string]: number};
  slug: string;
  tagList: string[];
}

function PostMatter(props: PostMatter) {
  const {title, date, SWRfallback, slug, tagList}=props;
  const dateObj=new Date(date);
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.infoContainer}>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj)}
        </time>
        <div className={styles.line}></div>
        <SWRConfig value={SWRfallback}>
          <ViewCounter slug={slug} />
        </SWRConfig>
      </div>
      <ul className={styles.tagList}>
        {tagList.map((tag: string)=>
          <li key={tag} className={styles.tag}>{tag}</li>
        )}
      </ul>
    </>
  );
}

function PostPage({
  post, fallback
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO information omitted */
  const slug=post._raw.flattenedPath.split('/')[1];

  return (
    <main className={styles.page}>
      <NextSeo {...SEOInfo} />
      <article className={styles.container}>
        <PostMatter 
          title={post.title}
          date={post.date}
          SWRfallback={fallback}
          slug={slug}
          tagList={post.tags}
        />
        <TableOfContents nodes={post._raw.headingTree} />
        {'code' in post.body?
          <div className={contentStyles.content}>
            <MDXComponent code={post.body.code}/>
          </div>
          :
          <div
            className={contentStyles.content} 
            dangerouslySetInnerHTML={{ __html: post.body.html }} 
          />
        }
      </article>
      {blogConfig.comment?.type === 'giscus'?<Giscus />:null}
    </main>
  );
}
```

You can now see comments appearing successfully on each chapter's detail page.

# 4. Search Functionality

Let’s build the search functionality. The search will be implemented as follows:

1. Create a page that displays all posts for searching.
2. Collect metadata from markdown files during conversion (using remark plugins).
3. Perform searches based on the collected metadata.
4. Display only the resulting objects through card components on the screen.

## 4.1. Creating the Search Page

First, let's create the page that displays all posts. The previously created `src/pages/posts/index.tsx` will be quite useful here.

```tsx
import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useRouter } from 'next/router';

import Card from '@/components/card';
import PageContainer from '@/components/pageContainer';
import { getSortedPosts } from '@/utils/post';
import { DocumentTypes } from 'contentlayer/generated';

import styles from './styles.module.css';

interface PostMetaData{
  title: string;
  description: string;
  date: string;
  tags: string[];
  url: string;
}

function AllPostListPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} Search`}</h2>
      <ul className={styles.list}>
        {postList.map((post: PostMetaData) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
    </PageContainer>
  );
}

export default AllPostListPage;

export const getStaticProps: GetStaticProps = () => {
  const postList = getSortedPosts().map((post: DocumentTypes) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  return { props: { category:'All Posts', postList } };
};
```

Next, let’s create a simple search input. Create a folder `src/components/searchConsole/` and create `index.tsx` and `styles.module.css`.

```tsx
// src/components/searchConsole/index.tsx
import styles from './styles.module.css';

function SearchConsole() {
  return (
    <input
      className={styles.input}
      placeholder='Enter search term'
    />
  );
}

export default SearchConsole;
```

The input’s styling is kept simple.

```css
// src/components/searchConsole/styles.module.css
.input{
  width: 100%;
  height: 2.5rem;
  border: 1px solid var(--borderGray);
  border-radius: 0.25rem;

  margin:1rem 0;
  padding:0.5rem 0.75rem;

  color: var(--textGray);
  font-size: 1rem;
  background-color: var(--bgColor);

  appearance: none;
}
```

## 4.2. Search Functionality

The essence of the search functionality is to filter the displayed results based on a search term that users input. Therefore, we will manage the search term data within the `AllPostListPage` component found in `src/pages/posts/index.tsx`, which will filter the displayed posts based on that term.

First, let’s craft a function to filter posts based on the search term, using the array of `PostMetaData` type.

```ts
// src/pages/utils/filterPosts.ts
import { PostMetaData } from '@/components/categoryPagination';

function filterPostsByKeyword(posts: PostMetaData[], keyword: string) {
  if (keyword==='') return posts;
  return posts.filter((post: PostMetaData) => {
    const titleMatched = post.title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase());
    const descriptionMatched = post.description.toLocaleLowerCase().includes(keyword.toLocaleLowerCase());
    return titleMatched || descriptionMatched;
  });
}

export default filterPostsByKeyword;
```

Next, let’s adapt the `SearchConsole` component so it captures the input value as the search term and reflects that change back to the parent `PostSearchPage` component.

```tsx
import { ChangeEvent } from 'react';

import styles from './styles.module.css';

interface Props{
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function SearchConsole(props: Props) {
  const {value, onChange}=props;

  return (
    <input
      className={styles.input}
      placeholder='Enter search term'
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchConsole;
```

Now, use this in `src/pages/posts/index.tsx`. Create a state for `searchKeyword` and write the function `onKeywordChange` to pass that to the `SearchConsole`.

```tsx
// src/pages/posts/index.tsx
function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, setSearchKeyword]=useState('');

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, []);

  const filteredPostList = filterPostsByKeyword(postList, searchKeyword);

  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} Search`}</h2>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      <ul className={styles.list}>
        {filteredPostList.map((post: PostMetaData) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
    </PageContainer>
  );
}
```

With this setup, every time the search term is updated, the component will re-render, consequently updating the `filteredPostList` displayed.

## 4.3. Optimizing the Search with Debouncing

Currently, every change in the search input triggers a re-render of the `PostSearchPage`, which is quite resource-intensive. Thus, let’s implement debouncing to minimize these re-renders.

We will consider the input as complete if no changes occur within 300ms. Create a custom hook to manage the `searchKeyword` state and enable this functionality.

First, create a custom hook `useDebounce` to manage the debounce timing for a specific value.

```tsx
// src/pages/utils/useSearchKeyword.ts
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

Next, implement `useSearchKeyword` to return the search term, a setter for it, and the debounced value. We will also integrate handling of the query string in the URL so that users can share search results easily.

For instance, search results like `https://witch.work/?search=settimeout` can be generated.

The state will reset to the initial search term when the user navigates back. This uses the `onpopstate` event to facilitate managing the associated query string.

This requires using the [query-string](https://www.npmjs.com/package/query-string) package to handle the query string updates.

```ts
// src/pages/utils/useSearchKeyword.ts
function useSearchKeyword(): [string, string, (s: string) => void] {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  const onPopState = () => {
    const parsed = queryString.parse(location.search);
    setKeyword(parsed.keyword?.toString() || '');
  };
  
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const {search}=parsed;
    if (search) {
      setKeyword(search.toString());
    }
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    const parsed = queryString.parse(location.search);

    if (debouncedKeyword === parsed.search) return;

    parsed.search = debouncedKeyword;

    const nextURL = queryString.stringifyUrl({
      url: location.pathname,
      query: parsed,
    }, {
      skipEmptyString: true,
      skipNull: true,
    });

    history.pushState(parsed, '', nextURL);
  }, [debouncedKeyword]);

  return [keyword, debouncedKeyword, setKeyword];
}
```

Now, let’s make use of the `useSearchKeyword` in `src/pages/posts/index.tsx` so that our filtered results update based on the debounced values rather than the raw input.

```tsx
// src/pages/posts/index.tsx
function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, debouncedKeyword, setSearchKeyword]=useSearchKeyword();

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  /* searchKeyword changes trigger re-render, 
  but the displayed results are based on debouncedKeyword */
  const filteredPostList = filterPostsByKeyword(postList, debouncedKeyword);

  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} Search`}</h2>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      <ul className={styles.list}>
        {filteredPostList.map((post: PostMetaData) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
    </PageContainer>
  );
}
```

## 4.4. Routing for the Search Page

This search functionality is currently accessible via the `/posts` route. Let’s make it reachable from the header. I will use the search icon obtained from [icons8](https://icons8.com/icon/set/search/ios-filled).

Create `src/components/header/search` folder and write the `Search` component.

```tsx
// src/components/header/search/index.tsx
/* imports omitted */
const searchIcon: {[key: string]: string}={
  'light':'/icons/icons8-search.svg',
  'dark':'/icons/icons8-search-dark.svg',
  'pink':'/icons/icons8-search-pink.svg',
};

const Search = () => {
  const { theme } = useTheme();

  return (
    <Link href='/posts' className={styles.search}>
      <Image 
        src={searchIcon[theme || 'light']} 
        alt='Search' 
        width={32} 
        height={50} 
        priority
      />
    </Link> 
  );
};

export default Search;
```

Set styles for the search icon.

```css
// src/components/header/search/styles.module.css
.search{
  width:40px;
  height:100%;
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
  align-items:center;
}
```

Integrate this search component into the header. Using dynamic imports allows us to ensure the correct icon is used according to the theme.

```tsx
/* src/components/header/index.tsx */
const Search = dynamic(() => import('./search'), { ssr: false });

interface PropsItem{
  title: string;
  url: string;
}

function Header({
  navList
}: {
  navList: PropsItem[];
}) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <HomeButton />
          <div className={styles.wrapper}>
            <ThemeChanger />
            <Menu navList={navList} />
            <Search />
          </div>
        </div>
      </nav>
    </header>
  );
}
```

# References

https://bepyan.github.io/blog/nextjs-blog/6-comments

https://giscus.app/ko

https://github.com/pacocoursey/next-themes

https://colorate.azurewebsites.net/Color/002395

Various color palettes https://yeun.github.io/open-color/

https://bepyan.github.io/blog/nextjs-blog/6-comments

DaisyUI colors https://github.com/saadeghi/daisyui/blob/master/src/theming/themes.js

DaisyUI color palette 2 https://unpkg.com/browse/daisyui@2.0.9/src/colors/themes.js

Possible code themes for shiki https://github.com/shikijs/shiki/tree/main/packages/shiki/themes

VSCode light pink theme color set https://github.com/mgwg/light-pink-theme/blob/master/themes/Light%20Pink-color-theme.json

Official next-themes documentation https://github.com/pacocoursey/next-themes

Implementing search functionality https://medium.com/frontendweb/build-the-search-functionality-in-a-static-blog-with-next-js-and-markdown-33ebc5a2214e

Debouncing https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa

Query-string https://www.npmjs.com/package/query-string

https://taero.blog/posts/debouncing-with-react

https://dev.to/franklin030601/how-to-create-a-search-engine-with-debounce-effect-4hef#8

https://github.com/vercel/next.js/issues/10608