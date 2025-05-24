import { MetadataRoute } from 'next';

import { postMetadata, postTags, translationsMetadata } from '#site/content';
import { blogConfig } from '@/config/blogConfig';
import { FIRST_PAGE, ITEMS_PER_PAGE } from '@/constants/pagination';
import { allTranslationNumber } from '@/constants/stats';
import { getRecentPosts } from '@/utils/content/postMetadata';

const createSitemapEntry = (path: string, lastModified?: Date): MetadataRoute.Sitemap[number] => {
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
  translations: '/translations/all',
};

const defaultSiteMap: MetadataRoute.Sitemap = [
  createSitemapEntry(staticRoutes.home, new Date(getRecentPosts()[0].date)),
  createSitemapEntry(staticRoutes.translations),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapForPostList: MetadataRoute.Sitemap = [];

  for (const tag of postTags) {
    const tagPath = `/posts/tag/${tag.slug}`;
    for (let page = 1; page <= Math.ceil(tag.count / ITEMS_PER_PAGE); page++) {
      const isFirstPage = page === FIRST_PAGE;
      const pagePath = isFirstPage ? tagPath : `${tagPath}/${page}`;
      sitemapForPostList.push(createSitemapEntry(pagePath));
    }
  }

  for (let page = 2; page <= Math.ceil(allTranslationNumber / ITEMS_PER_PAGE); page++) {
    const pagePath = `${staticRoutes.translations}/${page}`;

    sitemapForPostList.push(createSitemapEntry(pagePath));
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
