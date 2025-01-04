import { MetadataRoute } from 'next';

import { enPostMetadata, postMetadata, translationsMetadata } from '#site/content';
import { blogConfig } from '@/config/blogConfig';
import { locales } from '@/types/i18n';

const staticRoutes = [
  { path: '/', priority: 1 },
  { path: '/about', priority: 0.8 },
  { path: '/posts/all', priority: 0.8 },
];

const defaultSiteMap: MetadataRoute.Sitemap = staticRoutes.flatMap((route) => {
  return locales.map((lang) => {
    return {
      url: blogConfig[lang].url + route.path,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: route.priority,
    };
  });
});

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post) => {
    return {
      url: blogConfig.ko.url + post.url,
      lastModified: new Date(post.date),
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });

  const sitemapFromTranslations: MetadataRoute.Sitemap = translationsMetadata.map((translation) => {
    return {
      url: blogConfig.ko.url + translation.url,
      lastModified: new Date(translation.date),
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });

  const sitemapFromEnPosts: MetadataRoute.Sitemap = enPostMetadata.map((post) => {
    return {
      url: blogConfig.ko.url + post.url,
      lastModified: new Date(post.date),
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });

  return [
    ...defaultSiteMap,
    ...sitemapFromPosts,
    ...sitemapFromTranslations,
    ...sitemapFromEnPosts,
  ];
}
