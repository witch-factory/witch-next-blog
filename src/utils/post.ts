import {
  Post,
  posts,
  postMetadata,
  PostMetadata,
  postTags,
  translations,
  translationsMetadata,
  TranslationMetadata,
  enPosts,
  enPostMetadata,
  Tag,
  enPostTags,
} from '#site/content';
import { Language } from '@/types/i18n';

const langPostMap: Record<Language, Post[]> = {
  ko: posts,
  en: enPosts,
};

const langPostMetadataMap: Record<Language, PostMetadata[]> = {
  ko: postMetadata,
  en: enPostMetadata,
};

const langPostTagsMap: Record<Language, Tag[]> = {
  ko: postTags,
  en: enPostTags,
};

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const sortByDate = <T extends { date: string }>(data: T[]): T[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getSortedPosts = (lang: Language = 'ko') => {
  return sortByDate(langPostMap[lang]);
};

export const getSortedPostMetadatas = (lang: Language = 'ko') => {
  return sortByDate(langPostMetadataMap[lang]);
};

// 번역글은 언어에 상관 없음
export const getSortedTranslations = () => {
  return translations.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const getSortedTranslationsMetadatas = () => {
  return translationsMetadata.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const allPostNumber = postMetadata.length;
export const allEnPostNumber = enPostMetadata.length;
export const allTranslationNumber = translationsMetadata.length;

// 태그의 slug를 받아서 해당 태그의 글 수를 반환
export const tagPostNumber = (lang: Language, tagSlug: string) => {
  return langPostTagsMap[lang].find((tagElem) => tagElem.slug === tagSlug)?.count;
};

type Page = {
  currentPage: number,
  postsPerPage: number,
  tag?: string,
};

export const getPostsByPage = (page: Page, lang: Language = 'ko') => {
  const { currentPage, postsPerPage, tag } = page;
  if (tag) {
    const tagPosts = getSortedPostMetadatas(lang).filter((post) =>
      post.tags.some((postTag) => slugify(postTag) === tag),
    );
    const pagenatedPosts = tagPosts.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage,
    );
    return { pagePosts: pagenatedPosts, totalPostNumber: tagPosts.length };
  }

  const pagenatedPosts = getSortedPostMetadatas(lang).slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );
  return { pagePosts: pagenatedPosts, totalPostNumber: posts.length };
};

export const getTranslationsByPage = (page: Omit<Page, 'tag'>) => {
  const { currentPage, postsPerPage } = page;
  const pagenatedPosts = getSortedTranslationsMetadatas().slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );
  return { pagePosts: pagenatedPosts, totalPostNumber: translations.length };
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
  return langPostTagsMap[lang].filter((tag) => tag.name !== 'All');
};

// 페이지당 몇 개의 글이 보이는가
export const ITEMS_PER_PAGE = 10;
// 첫 번째 페이지
export const FIRST_PAGE = 1;
