import { MetadataRoute } from 'next';

import { postMetadata, translationsMetadata } from '#site/content';
import { blogConfig } from '@/config/blogConfig';

const staticRoutes = [
  { path: '/', priority: 1 },
  { path: '/about', priority: 0.8 },
  { path: '/posts/all', priority: 0.8 },
];

const defaultSiteMap: MetadataRoute.Sitemap = staticRoutes.map((route) => {
  return {
    url: blogConfig.baseUrl + route.path,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route.priority,
  };
});

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post) => {
    return {
      url: blogConfig.baseUrl + post.url,
      lastModified: new Date(post.date),
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });

  const sitemapFromTranslations: MetadataRoute.Sitemap = translationsMetadata.map((translation) => {
    return {
      url: blogConfig.baseUrl + translation.url,
      lastModified: new Date(translation.date),
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });

  return [
    ...defaultSiteMap,
    ...sitemapFromPosts,
    ...sitemapFromTranslations,
  ];
}
