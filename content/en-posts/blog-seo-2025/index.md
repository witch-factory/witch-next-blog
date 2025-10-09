---
title: Improving SEO for Next.js Blog - Sitemap Optimization and Adding Structured Data
date: "2025-05-25T00:00:00Z"
description: "Traffic to my blog has started to decline. Let's improve it by optimizing the sitemap and adding structured data with JSON-LD."
tags: ["blog", "web"]
---

# Introduction

I regularly monitor the traffic to my blog. However, one day I noticed that my search traffic began to drop. While it could be due to many great articles on similar topics, I didn't think that was the main reason. It was more likely that some issues arose during changes I made to the blog's structure. I am not an SEO expert, but I did my best to enhance my blog's search engine optimization. This article documents that process.

The basic elements like the blog's title, description, keyword insertion, and og images are already set. Therefore, I will only record the improvements I made in other areas. I have summarized the references at the end of the article.

# Sitemap Improvement

## Adding Language-Specific Pages to Sitemap

My blog currently has a sitemap. I previously wrote about the basic process of creating a sitemap in the article [Fixing the Blog - Adding a Sitemap to Next.js Pages](https://witch.work/ko/posts/blog-nextjs-sitemap-generation).

The problem arose after I added an English version of the pages without updating the sitemap. So, I added the pages for each language to the sitemap. In Next.js's `sitemap.ts`, it supports writing localized versions of pages using `alternates.languages` if separate pages exist for different languages.

To avoid repeating the code for creating sitemap entries for each language, I separated it into a function as follows:

```ts
const createSitemapEntry = (path: string, lastModified: Date): MetadataRoute.Sitemap[number] => {
  return {
    url: blogConfig.baseUrl + path,
    lastModified,
    alternates: {
      languages: {
        ko: blogConfig.baseUrl + '/ko' + path,
        en: blogConfig.baseUrl + '/en' + path,
      },
    },
  };
};
```

According to [Google Search Center's sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps), Google’s search bot ignores priority and changefreq, so I did not set them in the function.

After creating the sitemap using `alternates.languages`, you should be able to check the completed sitemap at the `/sitemap.xml` route. However, there is an issue when opening `/sitemap.xml` in browsers like Chrome, where it doesn't display in XML format and shows just text instead.

If you look in the network tab of developer tools, you can see that the sitemap is generated correctly. This is a problem with the browser's XML viewer. There is also a reported [issue in Next.js](https://github.com/vercel/next.js/issues/67005#issuecomment-2474289548). The XML schema address automatically redirects from http to https, causing the XML viewer not to function properly.

However, after checking with Google, Bing, and sitemap validation tools, there seems to be no issue with sitemap generation and recognition. Thus, we can ignore the problem with the XML viewer in browsers.

## Adding Post List Pages to Sitemap

In addition, the sitemap should include not just individual post pages but also list pages to ensure all pages are connected through the sitemap. This is important because users may not always jump directly from the main page to detailed post pages. Therefore, I added each post list page to the sitemap using the count of all posts stored as a constant.

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  // Generate sitemap entry for each post list page
  for (let page = 2; page <= Math.ceil(allPostNumber / ITEMS_PER_PAGE); page++) {
    const pagePath = `${staticRoutes.posts}/${page}`;

    sitemapForPostList.push(createSitemapEntry(pagePath, new Date()));
  }

  // ...
  return [
    ...defaultSiteMap,
    ...sitemapForPostList,
    ...sitemapFromPosts,
    ...sitemapFromTranslations,
  ];
}
```

You could also add pages for each tag to the sitemap by iterating over the post tags and generating each tag page.

## Last Modified Date of Content

It is recommended to include the important content's last modified date as `lastmod` in the sitemap. This is used as a signal for scheduling crawling of previously indexed URLs. Additionally, `lastmod` affects how bots determine the trustworthiness of the page.

> If a page was modified 7 years ago but the lastmod element indicates it was modified yesterday, Google will no longer trust the last modified date of that page.
>
> [Google Search Center, "Discontinuation of Sitemap Ping Endpoint"](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping?hl=ko)

Therefore, I changed the sitemap's `lastmod`, which was previously set to `new Date()`, to the actual content date. For example, for the main page, I set it to the date of the most recent post, and for individual post pages, I set it to the post's date.

```ts
// Existing sitemap entry for the main page
createSitemapEntry(staticRoutes.home, new Date()),
// After modification
createSitemapEntry(staticRoutes.home, new Date(getRecentPosts()[0].date)),

// Existing code for generating individual post page sitemap entries
const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post) => createSitemapEntry(post.url, new Date()));
// After modification
const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post) => createSitemapEntry(post.url, new Date(post.date)));
```

However, I did not include `lastmod` for the pages showing post lists by tag. For pages that display aggregated content, determining the last modified date can be difficult, and [Google Search Center's document](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping) also states that `lastmod` does not need to be included in such cases.

# Creating Structured Data for Pages with JSON-LD

Creating structured data for pages can help search engines better understand the content of the web pages. While search engines may not necessarily include this data, it can provide additional information in search results, potentially increasing click-through rates. Therefore, I attempted to enhance my blog's SEO by writing this structured data.

There are various ways to create structured data, and I will use JSON-LD (JSON for Linking Data) for this task. I find JSON familiar, and [Next.js provides related guidance](https://nextjs.org/docs/app/guides/json-ld).

## Structured Data for Blog Posts

First, I added structured data to the page displaying the blog posts. Google Search Center provides a [list of supported structured data types](https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=ko), and a suitable type for blog posts is `BlogPosting`.

I wrote it as follows. I referenced examples from JSON-LD.com [Blog Post Schema Example](https://jsonld.com/blog-post/), GitHub [BlogPosting Schema Example](https://gist.github.com/warnakey/2643c2501b2753bd8ba932f6a0bcf1d9), and Google Search Center's [structured article data guide](https://developers.google.com/search/docs/appearance/structured-data/article?hl=ko), including all properties supported by Google.

Then, I inserted the JSON-LD based on an example in the Next.js official documentation using the `<script>` tag.

```tsx
async function PostPage({ params }: Props) {
  // Other code omitted...
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'url': blogLocalConfig[lang].url + post.url,
    'author': {
      '@type': 'Person',
      'name': blogLocalConfig[lang].name,
      'url': blogLocalConfig[lang].url,
    },
    'datePublished': post.date,
    'dateModified': post.date,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': blogLocalConfig[lang].url + post.url,
    },
    'image': {
      '@type': 'ImageObject',
      'url': post.thumbnail,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Remaining content of the blog post */}
    </>
  );
}
```

## Structured Data for Blog Main Page

Next, I added structured data to the main blog page. I thought that possibly a `WebSite` type structured data might be suitable for the main page, but it was not included in Google’s list of supported structured data.

Since this is my personal blog, I decided to use the [`ProfilePage` type structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ko), which allows including information about the author along with recent activities.

I created and inserted the following structured data in the page. I used references from [Blog Homepage Schema Example](https://gist.github.com/warnakey/5ada39a24ccc98c2b889e84c44d4a468), schema.org’s [Blog Schema](https://schema.org/Blog), and Google Search Center's [structured profile page data guide](https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ko). I included the most recent three posts using the `hasPart` property and structured the data for each post's title, description, URL, and publish date.

```tsx
async function Home({ params }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    'mainEntity': {
      '@id': '#blog-owner',
      '@type': 'Person',
      'name': blogLocalConfig[lang].name,
      'alternateName': 'Witch',
      'url': blogLocalConfig[lang].url,
      'image': blogLocalConfig[lang].thumbnail.cloud,
      'description': blogLocalConfig[lang].description,
      'sameAs': [
        'https://github.com/witch-factory',
        'https://witch.work',
      ],
    },
    'hasPart': recentPosts.slice(0, 3).map((post) => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.description,
      'url': blogLocalConfig[lang].url + post.url,
      'datePublished': post.date,
      'author': {
        '@id': '#blog-owner',
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Remaining content of the blog main page */}
    </>
  );
}
```

After diligently creating structured data, you can check it using Google's [Rich Results Test tool](https://search.google.com/test/rich-results) to confirm whether the structured data is correctly included and if there are any errors in how it is written.

# Conclusion

In addition to these improvements, I made several minor tweaks, like using `<ul>` tags for unordered lists in the blog code to create more semantic HTML, optimizing images with `next/image`, and registering the sitemap with Bing Search Console. However, I believe these points are situational improvements rather than general recommendations, so I will omit them.

In any case, I improved the missing parts of the blog's sitemap and added structured data to each page to attempt search engine optimization. This work may not lead to an immediate increase in search traffic. I also understand that while technical SEO is important, consistently producing and promoting good content is even more crucial.

However, I hope that a reliable structure will lead to better evaluation by search engines. By learning from various materials, I understand how search engines read and interpret the pages I create, which makes this work meaningful. I will monitor if there is an improvement in search traffic and update this article as needed.

Additionally, page performance is significantly important for SEO, which can be checked using tools like [PageSpeed Insights](https://pagespeed.web.dev/?hl=ko) and [CrUX Report](https://developer.chrome.com/docs/crux?hl=ko). I will write a separate article about improving page performance.

# References

Next.js SEO Learn Document

https://nextjs.org/learn/seo

Google's Basic Guide to Search Engine Optimization (SEO)

https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko

Google Search Center's webtoon related to Google Search Console

https://developers.google.com/search/blog/2021/05/search-console-webtoon-ep05?hl=ko

Sitemap attribute `<priority>` and `<last-modified>`

https://support.google.com/webmasters/thread/99881767/sitemap-attribute-priority-and-last-modified?hl=en

Build and submit a sitemap

https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

Issue with adding "alternates" in the sitemap #66574

https://github.com/vercel/next.js/issues/66574

Cannot create app router localized sitemap #67005

https://github.com/vercel/next.js/issues/67005#issuecomment-2474289548

Next.js sitemap generation source code

https://github.com/vercel/next.js/blob/main/packages/next/src/build/webpack/loaders/metadata/resolve-route-data.ts

Discontinuation of Sitemap Ping Endpoint

https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping?hl=ko#changefreq-and-priority

Introduction to Structured Data Markup in Google Search

https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=ko

List of structured data markup supported in Google Search

https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=ko

Structured Profile Page (ProfilePage) Data

https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ko

How to implement JSON-LD in your Next.js application

https://nextjs.org/docs/app/guides/json-ld

Informing Google of Localized Versions of Pages

https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko#xdefault