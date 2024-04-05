import { MetadataRoute } from 'next';

import { postMetadata } from '#site/content';
import { blogConfig } from '@/config/blogConfig';

const defaultSiteMap: MetadataRoute.Sitemap = [
  {
    url:blogConfig.url,
    lastModified:new Date(),
    changeFrequency:'daily',
    priority:1,
  },
  {
    url:blogConfig.url + '/about',
    lastModified:new Date(),
    changeFrequency:'daily',
    priority:0.8,
  },
  {
    url:blogConfig.url + '/posts/all',
    lastModified:new Date(),
    changeFrequency:'daily',
    priority:0.8,
  },
];


export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post)=>{
    return {
      url:blogConfig.url + post.url,
      lastModified:new Date(post.date),
      changeFrequency:'daily',
      priority:0.7,
    };
  });
  return [...defaultSiteMap, ...sitemapFromPosts];
}