import { MetadataRoute } from 'next';

import { postMetadata, translationsMetadata } from '#site/content';
import { blogConfig } from '@/config/blogConfig';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import { allPostNumber, allTranslationNumber } from '@/constants/stats';

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

const staticRoutes = {
  home: '/',
  posts: '/posts/tag/all',
  translations: '/translations/all',
};

const defaultSiteMap: MetadataRoute.Sitemap = [
  createSitemapEntry(staticRoutes.home, new Date()),
  createSitemapEntry(staticRoutes.posts, new Date()),
  createSitemapEntry(staticRoutes.translations, new Date()),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapForPostList: MetadataRoute.Sitemap = [];

  // 각 글 목록 페이지에 대한 sitemap entry를 생성
  for (let page = 2; page <= Math.ceil(allPostNumber / ITEMS_PER_PAGE); page++) {
    const pagePath = `${staticRoutes.posts}/${page}`;

    sitemapForPostList.push(createSitemapEntry(pagePath, new Date()));
  }

  for (let page = 2; page <= Math.ceil(allTranslationNumber / ITEMS_PER_PAGE); page++) {
    const pagePath = `${staticRoutes.translations}/${page}`;

    sitemapForPostList.push(createSitemapEntry(pagePath, new Date()));
  }

  const sitemapFromPosts: MetadataRoute.Sitemap = postMetadata.map((post) => createSitemapEntry(post.url, new Date(post.date)));

  const sitemapFromTranslations: MetadataRoute.Sitemap = translationsMetadata.map((translation) => createSitemapEntry(translation.url, new Date(translation.date)));

  return [
    ...defaultSiteMap,
    ...sitemapForPostList,
    ...sitemapFromPosts,
    ...sitemapFromTranslations,
  ];
}
