import {
  posts,
  postMetadata,
  PostMetadata,
  postTags,
  translations,
  translationsMetadata,
  TranslationMetadata,
  enPosts,
  enPostMetadata,
  enPostTags,
} from '#site/content';
import { Language } from '@/types/i18n';

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const sortByDate = <T extends { date: string }>(data: T[]): T[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const sliceByPage = <T>(data: T[], page: number, itemsPerPage: number) =>
  data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

const sortedPost = sortByDate(posts);
const sortedPostMetadata = sortByDate(postMetadata);
const sortedEnPost = sortByDate(enPosts);
const sortedEnPostMetadata = sortByDate(enPostMetadata);

const sortedTranslations = sortByDate(translations);
const sortedTranslationsMetadata = sortByDate(translationsMetadata);

const langDataMap = {
  ko: {
    posts: sortedPost,
    metadata: sortedPostMetadata,
    tags: postTags,
  },
  en: {
    posts: sortedEnPost,
    metadata: sortedEnPostMetadata,
    tags: enPostTags,
  },
} satisfies Record<Language, object>;

export const getSortedPosts = (lang: Language = 'ko') => {
  return langDataMap[lang].posts;
};

export const getSortedPostMetadatas = (lang: Language = 'ko') => {
  return langDataMap[lang].metadata;
};

// 번역글은 언어에 상관 없음
export const getSortedTranslations = () => {
  return sortedTranslations;
};

export const getSortedTranslationsMetadatas = () => {
  return sortedTranslationsMetadata;
};

export const allPostNumber = postMetadata.length;
export const allEnPostNumber = enPostMetadata.length;
export const allTranslationNumber = translationsMetadata.length;

// 태그의 slug를 받아서 해당 태그의 글 수를 반환
export const getPostCountByTag = (lang: Language, tagSlug: string) => {
  return langDataMap[lang].tags.find((tag) => tag.slug === tagSlug)?.count ?? 0;
};

type Page = {
  currentPage: number,
  postsPerPage: number,
  tag?: string,
};

export const getPostsByPage = (page: Page, lang: Language = 'ko') => {
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
  return { pagePosts, totalPostNumber: translations.length };
};

function propsProperty(post: PostMetadata) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

function propsPropertyTranslation(post: TranslationMetadata) {
  const { title, description, date, url } = post;
  return { title, description, date, url };
}

export const getRecentPosts = (lang: Language = 'ko') => {
  return getSortedPostMetadatas(lang)
    .slice(0, 6)
    .map((post) => propsProperty(post));
};

export const getRecentTranslations = () => {
  return getSortedTranslationsMetadatas()
    .slice(0, 3)
    .map((post) => propsPropertyTranslation(post));
};

export const getSearchPosts = (lang: Language = 'ko') => {
  return getSortedPostMetadatas(lang).map((post) => propsProperty(post));
};

export const getAllPostTags = (lang: Language = 'ko') => {
  return langDataMap[lang].tags.filter((tag) => tag.name !== 'All');
};

// 페이지당 몇 개의 글이 보이는가
export const ITEMS_PER_PAGE = 10;
// 첫 번째 페이지
export const FIRST_PAGE = 1;
