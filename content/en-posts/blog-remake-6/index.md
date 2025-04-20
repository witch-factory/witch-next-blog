---
title: Creating a Blog - 6. Basic Page Layout
date: "2023-05-25T00:00:00Z"
description: "Let's enhance the readability of an unattractive page."
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Settings|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of the Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structure Design of the Detail Page|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Using Relative Paths for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Minor Page Configuration Improvements and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Page Element Layout Design|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Main Page Component Design|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Design of Post List/Content Page Components|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatic Thumbnail Generation for Posts|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements including Font and Card Designs|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Count to Posts|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Theme and Post Search Functionality|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improvements to Theme Icons and Thumbnail Layouts|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Post Classification to Tag-Based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Main Page Performance Optimization|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Pagination for Post Lists|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on the Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 1. Beginning of Design: Layout

![my-ugly-blog](./ugly-blog.png)

My blog currently looks very unattractive. There are no colors applied (apart from the default color on links), and it lacks any CSS, causing the links to appear in a stark blue which is quite chaotic.

However, the main issue is that the layout is haphazard. While I believe the HTML semantics are well-structured, everything is simply arranged from top to bottom. Considering how important layout is on a page, this is a significant problem.

The book [The Secrets of Website Design that Anyone Can Easily Learn](https://product.kyobobook.co.kr/detail/S000001033015) I referenced also emphasizes layout as the first item in its table of contents.

Furthermore, a series titled [Anyone Can Be a Designer](https://brunch.co.kr/@sarayun/22) by a designer with ten years of experience states that layout is the most fundamental of the four essential design elements. Anyone who has encountered a page with poor readability can easily understand this point.

Thus, let's utilize CSS to modify the layout of the page. Shall we start with the main page?

We will apply a mobile-first design approach. Many users will access my blog on mobile devices, and generally, computers have better performance. Therefore, I believe it is more efficient to load for mobile first and then apply media queries in the computer environment regarding speed.

Also, since this is my first time not using a CSS library, I will use the classic BEM (Block Element Modifier) naming convention appropriately.

# 2. Standardizing the Page Header and Footer

The current page header contains the navigation, and the footer has my name. Currently, these elements are only present on the main page. However, considering the information included in each header and footer, it makes sense to have these common to all pages.

Therefore, let's add them to all pages. This can be done by modifying `/src/pages/_app.tsx`.

```tsx
// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import Footer from '@/components/footer';
import Header from '@/components/header';
import blogCategoryList from 'blog-category';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header navList={blogCategoryList} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
```

Next, we remove the header and footer from `/src/pages/index.tsx`.

# 3. Content Area Width

Currently, the content on the blog page has a width of 100%, which fills the page completely. To ensure that the text does not appear cramped on smaller mobile screens, we should maximize the width of the content. This should generally be the answer. For screens narrower than 768px, I will add some padding on both sides, but the content should occupy nearly the entire screen.

However, on desktops with a width of 1920px, this wide layout may look excessive, making the text difficult to read due to too many characters in a single line. Therefore, we should impose a maximum width on the content. This will be achieved using the max-width property.

## 3.1. Considerations on Maximum Content Width

But what width should we target for the content?

The [Web Accessibility Guide](https://www.w3.org/WAI/tutorials/page-structure/styling/#line-length) states that the text container should not exceed 80 characters in width. It also recommends setting it as `max-width: 70rem`.

As the default font size is 16px, this implies a maximum width of approximately 1120px. I tested max-width at both 60rem and 70rem. Even at 1920px, the spacing does not appear excessively wide and looks fine.

So, I will set that level, as the spacing appears sufficient, but with text alone at this width, the number of characters per line seemed too many. So, what is an appropriate character count per line?

Studies on typography have found that people prefer shorter line lengths for online content, as they are perceived as more organized and easier to understand. The ideal line length is suggested to be around 40 to 55 characters.

Thus, our goals should be:

- The width of the content container should be between 60 to 70rem.
- Text should be configured to be 40 to 55 characters per line (i.e., 40 to 55rem).

We need to consider the main page, post list page, and detailed view page. For both the main page and post list page, we can set the maximum width to 60 to 70rem. This is achievable because we can restrict the number of text characters per line.

For the main page, we can envision the following layout:

![article-list](./article-list-layout.png)

The introduction section will feature my profile picture, allowing the width of the text area to remain within 40 to 55 characters, and the text within the post preview will naturally have fewer characters per line.

Additionally, on the post list page, we can limit the amount of text by inserting a thumbnail into the post preview card. I referred to the layout of [Toss Tech Blog](https://toss.tech/tech) for inspiration.

![article-list-page](./article-list-page-layout.png)

However, for the detailed view page, there are no specific devices to reduce the width of the content area (although we could consider placing a TOC (Table of Contents) on the side, but we can think about that later), so I considered simply setting the overall width to 50rem.

## 3.2. Configuring the Content Area Container

First, we will create a wrapper class for the main page in `/src/pages/styles.module.css` as follows. The other wrappers should follow suit, excluding the max-width.

```css
// /src/pages/styles.module.css
.pagewrapper{
  margin:0 auto;
  width:100%;
  min-height:100vh;
}

@media (min-width: 768px) {
  .pagewrapper{
    max-width:60rem;
  }
}
```

Next, we will add the className `styles.pagewrapper` to the main tag of `/src/pages/index.tsx` (importing the style should occur beforehand).

We should also create the same wrapper class in `/src/pages/posts/[category]/styles.module.css`.

```css
.pagewrapper{
  margin:0 auto;
  width:100%;
  min-height:100vh;
}

@media (min-width: 768px) {
  .pagewrapper{
    max-width:60rem;
  }
}
```

We will add the appropriate wrapper to the main tag of the page component in `/src/pages/[category]/index.tsx`.

```tsx
function PostListPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    // Adding page wrapper
    <main className={styles.pagewrapper}>
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
```

We will also define a class for the container of the detailed view in `/src/pages/posts/[category]/styles.module.css`.

```css
.pagewrapper{
  margin:0 auto;
  width:100%;
  min-height:100vh;
}

.articlewrapper{
  margin:0 auto;
  width:100%;
  min-height:100vh;
}

@media (min-width: 768px) {
  .pagewrapper{
    max-width:60rem;
  }

  .articlewrapper{
    max-width:50rem;
  }
}
```

Next, we will add the appropriate wrapper to the main tag of the page component in `/src/pages/posts/[category]/[slug].tsx`.

```tsx
function PostPage({
  post
}: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    // Adding here
    <main className={styles.articlewrapper}>
      <article>
        <h1>{post.title}</h1>
        <time>{post.date}</time>
        <ul>
          {post.tags.map((tag: string)=><li key={tag}>{tag}</li>)}
        </ul>
        {'code' in post.body?
          <MDXComponent code={post.body.code}/>:
          <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
        }
      </article>
    </main>
  );
}
```

After configuring this, I researched the page container widths of several corporate tech blogs. Most of them, like what I have implemented, use a method to limit the max-width.

Toss has 980px (with an internal container of 92% width, making the actual content width smaller), Baemin has 900px, Google 978px, ToastUI 1060px, and Line 790px, roughly similar to my setup. Although the 60rem (960px) I've set may not be the ultimate solution, it does not seem to be a terribly inaccurate figure.

Now let's modify the layouts of some components on the page, such as the main page and post list page.

For reference, the properties such as `min-height:100vh` mentioned earlier are often assigned through a wrapper div as a default practice. However, this is a practice that arose because [older versions of IE did not consistently apply certain CSS rules to some tags, and it's not necessary to strictly adhere to that practice now](https://stackoverflow.com/questions/27582691/why-is-web-content-wrapped-in-a-wrapper-div).

# 4. Overview Layout of the Main Page

The current main page can semantically be divided into four areas: header, introduction, post list, and footer.

![whole-page-map](./whole-page-map.png)

Here, the header and footer are not immediately problematic, so let's focus on the introduction and post list sections.

## 4.1. Introduction Area of the Main Page

The main page is the first page users will see when they access my blog. Hence, the introduction should indeed be at the top, but it would also be beneficial for the blog content to be appropriately exposed. This applies equally in mobile environments, so we want a layout that does not take up excessive space while still looking appropriate.

Therefore, I considered the following responsive layout:

![intro-section-layout](./intro-section-layout.png)

How to implement this? Firstly, the arrangement of the name, introduction text, and links is initially vertical, so there is no need to modify that. However, to prevent the image and layout from mixing, let's wrap this part in a div. We can create a CSS module file in `src/components/profile` named `styles.module.css`.

The image should be displayed when the screen width is larger than 768px, which is the threshold commonly used to differentiate mobile from desktop. After the image, we want other vertically arranged elements, so we will set the introduction box's display to flex for horizontal alignment. This setting should only apply when the screen width exceeds 768px.

Additionally, we want the links to be arranged horizontally. Thus, we will set flex on the ul component wrapping the links without needing a media query. We also want to eliminate bullet points, ensuring a suitable gap between links.

The CSS classes for this can be defined as follows:

```css
// src/components/profile/profile.module.css
.profile__image{
  display:none;
}

.profile__linklist{
  display:flex;
  flex-direction:row;
  list-style:none;
  padding-left:0;
  gap:0 15px;
}

@media (min-width:768px){
  .profile__image{
    display:block;
  }

  .profile{
    display:flex;
    flex-direction:row;
  }
}
```

Next, we will use these classes in the Profile component:

```tsx
// src/components/profile/index.tsx
import styles from './profile.module.css';

function Profile() {
  return (
    <article className={styles.profile}>
      <Image className={styles.profile__image} src={blogConfig.picture} alt={`${blogConfig.name}'s profile picture`} width={80} height={80} />
      <div>
        <h2>{blogConfig.name}</h2>
        <p>{blogConfig.description}</p>
        <ul className={styles.profile__linklist}>
          <li>
            <Link href={blogConfig.social.github} target='_blank'>
            Github
            </Link>
          </li>
          <li>
            <Link href={blogConfig.social.BOJ} target='_blank'>
            BOJ
            </Link>
          </li>
        </ul>
      </div>
    </article>
  );
}
```

After applying this, we can confirm that the profile picture appears to the left of the introduction text and disappears as the screen width decreases. The links are also well-arranged horizontally.

## 4.2. Post List Area of the Main Page

Regarding the arrangement of the post list on the main page, the following requirements come to mind:

1. Text should not appear cramped on mobile. The same goes for the PC environment.
2. When the page loads, it should show as many posts as possible from the main page.

To fulfill these criteria, especially prioritizing the first requirement, I have thought of the following element arrangement. To avoid a cramped appearance on mobile, I believe each post preview card should take up the full width.

![article-list](./article-list-layout.png)

Again, we will create a `src/components/category/styles.module.css` file. We will just ensure that when the screen width exceeds a certain threshold, the elements will be arranged horizontally. In addition, we will eliminate bullet points and provide gaps when arranged horizontally.

```css
.category__cardlist{
  list-style:none;
}

@media (min-width:768px){
  .category__cardlist{
    display: flex;
    flex-direction:row;
    gap:20px;
  }
}
```

Then, we will apply `styles.category__cardlist` to the ul tag in `src/components/category/index.tsx`.

With all this implemented, the layout will change as follows. Although it still looks quite unattractive, it appears much improved compared to before.

![temp-layout](./temp-layout.png)

# References

https://brunch.co.kr/@sarayun/22

https://merrily-code.tistory.com/154

https://socialtriggers.com/perfect-content-width/