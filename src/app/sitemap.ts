import { MetadataRoute } from 'next';

import { postMetadata } from '#site/content';
import { blogConfig } from '@/config/blogConfig';

const defaultSiteMap: MetadataRoute.Sitemap = [
  {
    url:blogConfig.url,
    lastModified:new Date(),
    priority:1,
  },
  {
    url:blogConfig.url + '/about',
    lastModified:new Date(),
    priority:0.8,
  },
  {
    url:blogConfig.url + '/posts/all',
    lastModified:new Date(),
    priority:0.8,
  },
];


export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapFromPosts = postMetadata.map((post)=>{
    return {
      url:blogConfig.url + post.url,
      lastModified:new Date(post.date),
    };
  });
  return [...defaultSiteMap, ...sitemapFromPosts];
}