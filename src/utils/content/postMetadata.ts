import {
  postMetadata,
  enPostMetadata,
  PostMetadata,
  translationsMetadata,
} from '#site/content';
import { Locale } from '@/types/i18n';

import { allTranslationNumber, propsProperty, propsPropertyTranslation, sliceByPage, slugify, sortByDate } from './helper';

const sortedPostMetadata = sortByDate(postMetadata);
const sortedEnPostMetadata = sortByDate(enPostMetadata);

const sortedTranslationsMetadata = sortByDate(translationsMetadata);

const langPostMetadataMap = {
  ko: {
    metadata: sortedPostMetadata,
  },
  en: {
    metadata: sortedEnPostMetadata,
  },
} as Record<Locale, { metadata: PostMetadata[] }>;

export const getSortedPostMetadatas = (lang: Locale = 'ko') => {
  return langPostMetadataMap[lang].metadata;
};

export const getSortedTranslationsMetadatas = () => {
  return sortedTranslationsMetadata;
};

type Page = {
  currentPage: number,
  postsPerPage: number,
  tag?: string,
};

export const getPostsByPage = (page: Page, lang: Locale = 'ko') => {
  const { currentPage, postsPerPage, tag } = page;
  const metadata = getSortedPostMetadatas(lang);

  const filteredPosts = tag
    ? metadata.filter((post) => post.tags.some((postTag) => slugify(postTag) === tag))
    : metadata;

  const pagePosts = sliceByPage(filteredPosts, currentPage, postsPerPage);
  return { pagePosts, totalPostNumber: filteredPosts.length };
};

export const getTranslationsByPage = (page: Omit<Page, 'tag'>) => {
  const { currentPage, postsPerPage } = page;
  const sortedTranslations = getSortedTranslationsMetadatas();
  const pagePosts = sliceByPage(sortedTranslations, currentPage, postsPerPage);

  return { pagePosts, totalPostNumber: allTranslationNumber };
};

export const getRecentPosts = (lang: Locale = 'ko') => {
  return getSortedPostMetadatas(lang)
    .slice(0, 6)
    .map((post) => propsProperty(post));
};

export const getRecentTranslations = () => {
  return getSortedTranslationsMetadatas()
    .slice(0, 3)
    .map((post) => propsPropertyTranslation(post));
};

export const getSearchPosts = (lang: Locale = 'ko') => {
  return getSortedPostMetadatas(lang).map((post) => propsProperty(post)).slice(0, 10);
};
