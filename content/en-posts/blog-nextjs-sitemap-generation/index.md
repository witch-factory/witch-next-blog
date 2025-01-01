---
title: Fixing the Blog - Adding a Sitemap to a Next.js Page
date: "2024-04-07T00:00:00Z"
description: "How to generate a sitemap for a page created with Next.js"
tags: ["blog", "web"]
---

# Introduction

Recently, I attended a presentation on [SEO for Technical Blogs](https://wormwlrm.github.io/2023/05/07/SEO-for-Technical-Blog.html) at the Frontend Conference of Gitto. One of the recommendations was to add a sitemap to the blog for SEO purposes.

I thought I was generating the sitemap using the [next-sitemap](https://www.npmjs.com/package/next-sitemap) library, but after the presentation, I checked and found it was not working properly. Fixing it wasn't very difficult, but in the meantime, Next.js 13's Metadata API has also begun to support sitemap generation.

Therefore, I decided to remove next-sitemap and add the sitemap based on the method outlined in the Next.js official documentation.

# 1. Generating a Static Sitemap

For a simple site, you can create a static sitemap by making an `app/sitemap.xml` file in the `app` folder. If you prefer, you can use a website like [xml-sitemaps](https://www.xml-sitemaps.com/) to generate the sitemap by simply inputting the site address.

For instance, if this blog only has a main page and an `/about` page, the `app/sitemap.xml` file can be created as follows:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://witch.work</loc>
    <lastmod>2024-04-05T16:47:38.737Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://witch.work/about</loc>
    <lastmod>2024-04-05T16:47:38.737Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

If the website is small and there are few or no new routes to be added to the sitemap, generating a static sitemap in this manner is a good idea. The added sitemap can be checked at the `/sitemap.xml` route.

# 2. Generating a Dynamic Sitemap

## 2.1. Basic Generation Method

You can dynamically generate the sitemap by using an `app/sitemap.ts` (you can also use `.js`). You need to create a function that returns an array of objects containing the URLs' information. This function should be exported as `export default`.

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://witch.work',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://witch.work/about',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }
  ]
}
```

Next.js provides the `MetadataRoute.Sitemap` type for the sitemap object. As shown above, this type is defined as follows, and you need to create an object array that matches this structure.

```typescript
type SitemapFile = Array<{
    url: string;
    lastModified?: string | Date;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
}>;
```

If you want to generate different sitemaps by region, you can add an `alternates` property to the object in the returned array of `app/sitemap.ts`.

Although `alternates` is not a property in the `SitemapFile` type, due to TypeScript's structural typing feature, adding object properties does not cause an error. The `alternates` property is converted properly into a sitemap element by Next.js.

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://witch.work',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          es: 'https://witch.work/es',
          en: 'https://witch.work/en',
        }
      }
    },
    // ...
  ]
}
```

Note that the dynamic sitemap in the `app/` folder will be ignored if there is an explicitly present `public/sitemap.xml`.

## 2.2. Application to Blog

For very large sites, it is possible to manage the sitemap by creating them per route. This method will be covered in the next section. However, since my blog is not that large, I decided to include all routes in the `app/sitemap.ts` file.

First, I created an array that includes the baseline routes that should be included in the sitemap.

```typescript
// app/sitemap.ts
const defaultSiteMap: MetadataRoute.Sitemap = [
  {
    url: 'https://witch.work',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: 'https://witch.work/about',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  },
  {
    url: 'https://witch.work/posts/all',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  },
];
```

Next, I combined the URLs obtained from the `postMetadata` array containing the title, URL, etc., with the previously created `defaultSiteMap` array.

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post) => {
    return {
      url: 'https://witch.work' + post.url,
      lastModified: new Date(post.date),
      changeFrequency: "daily",
      priority: 0.7,
    };
  });
  return [...defaultSiteMap, ...sitemapFromPosts];
}
```

Now you can access the sitemap at [https://witch.work/sitemap.xml](https://witch.work/sitemap.xml).

![Sitemap Generation Result](./sitemap-result.png)

In my case, it was not necessary, but if you need to create a sitemap using data from a server, you can make the `sitemap` function an `async` function to handle the data fetching asynchronously.

# 3. Generating Multiple Sitemaps

In my blog, the only dynamically generated URLs are the blog posts. Therefore, generating the entire sitemap at once is not problematic.

However, in large-scale web applications where there are many basic routes and diverse dynamically generated URLs, it may be impractical to create a sitemap in this way.

Generating the sitemap all in one file can complicate code logic management, and if the sitemap file becomes too large, search engines may take longer to read it.

Hence, Next.js supports the ability to split the sitemap generation into multiple files.

## 3.1. Using Route Folders

One way to distribute site maps across multiple files is to create `sitemap.(xml|js|ts)` files within route folders to generate individual sitemaps. For example, if you want to create a separate sitemap for the blog posts on my blog, you can create a file `pages/posts/sitemap.ts` to generate the sitemap. The format is the same as shown earlier.

```typescript
// pages/posts/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return postMetadata.map((post)=>{
    return {
      url: blogConfig.url + post.url,
      lastModified: new Date(post.date),
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });
}
```

In this case, you can view the sitemap for the blog posts at `https://witch.work/posts/sitemap.xml`. Be sure to register this sitemap address in services like Google Search Console.

## 3.2. Using generateSitemaps

This method can be used in conjunction with the previously described method and allows for generating multiple sitemaps from a single route. By using the `generateSitemaps` function, you can create several sitemaps.

First, modify the `generateSitemaps` function in `sitemap.ts` to return an array of objects with an `id` property.

```typescript
// app/sitemap.ts
export function generateSitemaps(): { id: number }[] {
  return [
    { id: 1 },
    { id: 2 },
  ];
}
```

This will serve as an argument to the `sitemap` function. The `sitemap` function now accepts an object with the `id` property, and you can make it return different sitemaps based on the `id`.

```typescript
// app/sitemap.ts
export default async function sitemap({
  id
}:{
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const serverData = await fetch(`https://example.com/api/sitemap/${id}`);

  return serverData.map((data)=>{
    return {
      url: data.url,
      lastModified: new Date(data.date),
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });
}
```

This allows you to check the sitemap at addresses like `/sitemap/1.xml`, `/sitemap/2.xml`, etc., corresponding to the `id`s returned by `generateSitemaps`.

This method can also be combined with the previous method of generating sitemaps within route folders. For instance, if my blog has a lot of posts and I want to distribute the sitemap among several files, I can use the `generateSitemaps` function.

You could generate sitemaps in batches of 100, making it possible to check the blog's `/posts/sitemap/1.xml`, `/posts/sitemap/2.xml`, etc.

```typescript
// app/sitemap.ts
export function generateSitemaps(): { id: number }[] {
  const sitemapCount = Math.ceil(postMetadata.length / 100);
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i + 1 }));
}

export default async function sitemap({
  id
}:{
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const start = (id - 1) * 100;
  const end = id * 100;
  const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.slice(start, end).map((post) => {
    return {
      url: 'https://witch.work' + post.url,
      lastModified: new Date(post.date),
      changeFrequency: "daily",
      priority: 0.7,
    };
  });
  return sitemapFromPosts;
}
```

# References

Next.js official documentation for sitemap.xml

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

GenerateSitemaps in Next.js documentation

https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps

Creating XML Sitemaps in Next.js

https://taedonn.tistory.com/40