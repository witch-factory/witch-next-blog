---
title: Blog Optimization - 1. Main Page Optimization
date: "2023-06-10T00:00:00Z"
description: "Rapid Witch: The First Step in Blog Optimization"
tags: ["blog", "web"]
---

# Blog Creation Series

|Title|Link|
|---|---|
|1. Basic Settings|[https://witch.work/posts/blog-remake-1](https://witch.work/posts/blog-remake-1)|
|2. HTML Design of the Main Page|[https://witch.work/posts/blog-remake-2](https://witch.work/posts/blog-remake-2)|
|3. Structure Design of Detailed Post Pages|[https://witch.work/posts/blog-remake-3](https://witch.work/posts/blog-remake-3)|
|4. Enabling Relative Path for Images|[https://witch.work/posts/blog-remake-4](https://witch.work/posts/blog-remake-4)|
|5. Minor Page Configuration Improvements and Deployment|[https://witch.work/posts/blog-remake-5](https://witch.work/posts/blog-remake-5)|
|6. Layout Design of Page Elements|[https://witch.work/posts/blog-remake-6](https://witch.work/posts/blog-remake-6)|
|7. Main Page Component Design|[https://witch.work/posts/blog-remake-7](https://witch.work/posts/blog-remake-7)|
|8. Writing List/Content Page Component Design|[https://witch.work/posts/blog-remake-8](https://witch.work/posts/blog-remake-8)|
|9. Automatic Thumbnail Generation|[https://witch.work/posts/blog-remake-9](https://witch.work/posts/blog-remake-9)|
|10. Design Improvements for Fonts, Cards, etc.|[https://witch.work/posts/blog-remake-10](https://witch.work/posts/blog-remake-10)|
|11. Adding View Counts to Posts|[https://witch.work/posts/blog-remake-11](https://witch.work/posts/blog-remake-11)|
|12. Page Themes and Post Search Functionality|[https://witch.work/posts/blog-remake-12](https://witch.work/posts/blog-remake-12)|
|13. Improving Theme Icons and Thumbnail Layouts|[https://witch.work/posts/blog-remake-13](https://witch.work/posts/blog-remake-13)|
|14. Changing Post Categorization to Tag-based|[https://witch.work/posts/blog-remake-14](https://witch.work/posts/blog-remake-14)|
|Main Page Computational Optimization|[https://witch.work/posts/blog-opt-1](https://witch.work/posts/blog-opt-1)|
|Creating Post List Pagination|[https://witch.work/posts/blog-opt-2](https://witch.work/posts/blog-opt-2)|
|Uploading Images to CDN and Creating Placeholders|[https://witch.work/posts/blog-opt-3](https://witch.work/posts/blog-opt-3)|
|Implementing Infinite Scroll on Search Page|[https://witch.work/posts/blog-opt-4](https://witch.work/posts/blog-opt-4)|

# 0. Overview

Many features of the blog have been completed. However, if you enter the deployed page, you can still notice that the page is quite slow. Therefore, I will begin the task of optimizing it to create a page that feels fast to anyone.

This task is named `Rapid Witch`, taking inspiration from the [Rapid Bull Project](https://www.kakaocorp.com/page/detail/9350), which was a server technology innovation project at KakaoTalk aimed at achieving high speeds.

# 1. Lighthouse Testing

First, I diagnosed my page using Google's well-known open-source Lighthouse, which checks web page quality. After installing the [Chrome extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk), I was able to easily obtain a diagnostic report.

![Lighthouse First Result](./lighthouse-result-first.png)

Overall, accessibility and SEO were satisfactory (best of all is next-seo!), while performance was lacking and Best Practices were inadequate. PWA readings were also far from ideal. Particularly for performance, despite the other elements being fine, the Total Blocking Time (time taken for a user to interact with the page) was a staggering 1220ms. [A good score requires TBT to be below 200ms](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/?utm_source=lighthouse&utm_medium=lr#how-lighthouse-determines-your-tbt-score), making this over six times that mark.

Thus, let’s work hard on performance optimization. Records of the optimizations I think of will be written in order, although the sequence may be somewhat random due to my search for methods.

# 2. Moving Computation to getStaticProps

On the main page, the `Home` component continuously calls `getSortedPosts`. This part does not change significantly after build, so we should move it to `getStaticProps`. By doing this, it will be called only at build time, potentially increasing build time, but the built page will load quickly.

Let's also ensure that only the necessary information required for post list rendering is passed.

First, remove the part calling `getSortedPosts` from the `Home` component in `src/pages/index.tsx`, and modify the `getStaticProps` in `src/pages/index.tsx` as follows.

```tsx
/* Types used in getStaticProps */
interface CardProps {
  title: string;
  description: string;
  image?: string;
  date: string;
  tags: string[];
  url: string;
}
/* Function to extract only necessary elements from the object */
function propsProperty(post: DocumentTypes) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

export const getStaticProps: GetStaticProps = () => {
  const categoryPostMap: { [key: string]: CardProps[] } = {};

  blogCategoryList.forEach((category) => {
    categoryPostMap[category.url] = getSortedPosts()
      .filter((post: DocumentTypes) => {
        return post._raw.flattenedPath.split('/')[0] === category.url.split('/').pop();
      })
      .slice(0, 3)
      .map((post: DocumentTypes) => {
        return propsProperty(post);
      });
  });

  return { props: { categoryPostMap } };
};
```

Doing this, an object containing `{"Category URL":[Top 3 Posts in the Category]}` will be passed as props to the page component. Utilize this to display the post list as before.

```tsx
export default function Home({
  categoryPostMap
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className={styles.pagewrapper}>
      <div className={styles.container}>
        <Profile />
        {/* Create project list */}
        <ProjectList />
        <article>
          {/* Create post list by category */}
          {blogCategoryList.map((category) => {
            const categoryPostList = categoryPostMap[category.url];

            return categoryPostList.length ?
              <Category 
                key={category.title} 
                title={category.title} 
                url={category.url} 
                items={categoryPostList}
              /> : null;
          })}
        </article>
      </div>
    </main>
  );
}
```

After making this change, the Lighthouse metrics improved significantly. The TBT reduced to about 470ms, nearly halving the time! It is evident how important it is to perform calculations in advance during the build and pass the necessary information.

![Lighthouse Second Result](./lighthouse-after-getStaticProps.png)

# 3. Image Optimization - next/image

Currently, the biggest issue with my blog is the slow loading, as noted earlier. Since NextJS supports various image optimizations, let's start with this.

First, enable Next.js image optimization. Update the `next.config.js` to turn on image optimization that was previously disabled due to Cloudflare. Since I'm only using the `Image` component from next/image on the main page, this will apply to all images.

```ts
const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
  },
  reactStrictMode: false,
  swcMinify: false,
};

module.exports = (withContentlayer(nextConfig));
```

# 4. Image Optimization - Image Size

Lighthouse suggests properly setting image sizes and links to the [sizes section](https://nextjs.org/docs/pages/api-reference/components/image#sizes) of the next/image tutorial.

The sizes property of the Image tag determines which images to download in the srcset during rendering, and also which source sets to automatically generate in next/image.

If sizes are not set, default sizes or fixed-size images might be automatically generated, which could negatively impact performance if these images are considerably larger than their actual display sizes. To prevent this, we should define sizes.

All images used on the main page pertain to project introductions and are defined in `src/components/projectCard/image/index.tsx`. Let's specify sizes in the Image component here.

```tsx
// src/components/projectCard/image/index.tsx
function ProjectImage({ title, image }: { title: string; image: string }) {
  return (
    <div className={styles.container}>
      <Image
        className={styles.image}
        src={image} 
        alt={`${title} project picture`}
        width={300}
        height={300}
        {/* Sizes have been added */}
        sizes='(max-width: 768px) 150px, 300px'
      />
    </div>
  );
}
```

With this change, TBT dropped to the low 300ms range, occasionally reaching below 200ms. Moreover, I recalled there is one more image on the main page—my profile picture in the profile component. Let's specify sizes for this as well.

```tsx
// src/components/profile/index.tsx
function Profile() {
  return (
    <article className={styles.profile}>
      <Image 
        className={styles.image} 
        src={blogConfig.picture} 
        alt={`${blogConfig.name}'s profile picture`} 
        width={100}
        height={100}
        sizes='100px'
      />
      <Intro />
    </article>
  );
}
```

Furthermore, edit the `next.config.js` to specify `images.imageSizes` and `images.deviceSizes` to limit [the number of srcset images](https://nextjs.org/docs/pages/api-reference/components/image#devicesizes) generated. This will reduce the number of srcsets generated for the images.

This should lead to a reduction in time when generating images upon initial requests. [Reference](https://fe-developers.kakaoent.com/2022/220714-next-image/). Therefore, I edited `next.config.js` as follows to allow only four srcsets.

```ts
const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    imageSizes: [64, 384],
    deviceSizes: [768, 1920],
  },
  reactStrictMode: false,
  swcMinify: false,
};

module.exports = (withContentlayer(nextConfig));
```

Let's strive to bring the TBT below 200ms.

# 5. Removing Unused JS

Lighthouse also recommends `Reduce unused JavaScript`. Here's the suggestion:

```
Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. 
```

In essence, this means to remove unused JS code or delay loading until necessary. Let's identify the problematic JS code.

![Unused JS Code](./reduce-js.png)

It seems evident that Google Tag Manager is the culprit. Therefore, we will edit the component providing it, `GoogleAnalytics.tsx`, and change the script loading strategy to `lazyOnload`. [This still allows GA to function properly.](https://blog.jarrodwatts.com/track-user-behaviour-on-your-website-with-google-analytics-and-nextjs)

```tsx
const GoogleAnalytics = () => {
  if (blogConfig.googleAnalyticsId == null) {
    return null;
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${blogConfig.googleAnalyticsId}`}
        strategy='lazyOnload'
      />
      <Script id='google-analytics' strategy='lazyOnload'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${blogConfig.googleAnalyticsId}');
        `}
      </Script>
    </>
  );
};
```

The time savings here may not be substantial. [Note that Google Tag Manager inherently makes network requests, subtly affecting execution time.](https://stackoverflow.com/questions/69449732/reduce-unused-javascript-from-gtm-script)

[Additionally, extensions seem to influence Lighthouse measurements. Testing in incognito mode yielded better scores.](https://all-dev-kang.tistory.com/entry/Next-%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80%EC%9D%98-%EC%84%B1%EB%8A%A5-%EA%B0%9C%EC%84%A0%EC%9D%84-%ED%95%B4%EB%B3%B4%EC%9E%90-1-featlighthouse)

# 6. Font and Serverless Optimization

Additionally, just in case, I opted for a lighter font used for generating thumbnails with canvas. I used a [lightweight version of Noto Sans Korean](http://theeluwin.github.io/NotoSansKR-Hestia/) in Bold style. The previous `.otf` file was nearly 5MB, while this one is under 300KB.

Furthermore, I changed the [default serverless region](https://vercel.com/docs/concepts/functions/serverless-functions/regions#select-a-default-serverless-region). I chose the Incheon region, which is closer to the Supabase's Korean region, anticipating faster API routes. (The default region was somewhere in the US.)

It is challenging to pinpoint precisely what has affected what, but after these changes, TBT has stabilized around the 200ms mark, even dipping into the 100ms range occasionally. Naturally, such metrics can fluctuate, occasionally reaching up to 500ms, but the improvement is significant.

![Good Lighthouse Result on Main Page](./lighthouse-good-result.png)

While further reductions are possible, the main page seems sufficiently fast now. However, the detailed post pages and list pages, which load numerous images, still need work, and there are many tasks remaining, including addressing Best Practices to some extent...

# 7. Reduce Initial Server Response Time

Numerous experiments revealed frequent suggestions to reduce initial server response time. Not seeing this message coincided with improved performance, but it remains a recurrent issue.

![Reduce Initial Server Response Time](reduce-initial-server-response-time.png)

This aspect actually impacts LCP, definitely affecting the visible parts to users, as this is related to how the page is painted. Optimizations regarding this will likely be explored in subsequent articles.

First, let's address what can be done on the post list/post detail pages.

# References

Using Lighthouse: https://velog.io/@dell_mond/Lighthouse-%EC%82%AC%EC%9A%A9%EB%B2%95

Lighthouse Result Metrics: https://medium.com/jung-han/%EB%9D%BC%EC%9D%B4%ED%8A%B8%ED%95%98%EC%9A%B0%EC%8A%A4-%EC%84%B1%EB%8A%A5-%EC%A7%80%ED%91%9C-%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B8%B0-83df3dc96fb9

Naver's SEO Documentation: https://searchadvisor.naver.com/guide/seo-basic-intro

Image Optimization in Next: https://fe-developers.kakaoent.com/2022/220714-next-image/

Next.js Script Tag: https://nextjs.org/docs/app/api-reference/components/script#strategy

GA functions well even with lazyOnload loading: https://blog.jarrodwatts.com/track-user-behaviour-on-your-website-with-google-analytics-and-nextjs

https://all-dev-kang.tistory.com/entry/Next-%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80%EC%9D%98-%EC%84%B1%EB%8A%A5-%EA%B0%9C%EC%84%A0%EC%9D%84-%ED%95%B4%EB%B3%B4%EC%9E%90-1-featlighthouse

http://theeluwin.github.io/NotoSansKR-Hestia/

https://www.oooooroblog.com/posts/62-optimize-images

https://velog.io/@ooooorobo/Lighthouse%EB%A1%9C-Next.js-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%84%B1%EB%8A%A5-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0#%EB%9D%BC%EC%9D%B4%ED%8A%B8%ED%95%98%EC%9A%B0%EC%8A%A4%EA%B0%80-%EB%8F%8C%EC%A7%80-%EC%95%8A%EC%9D%84-%EB%95%8C