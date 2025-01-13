import {
  posts,
  translations,
  enPosts,
  Post,
} from '#site/content';
import { Language } from '@/types/i18n';

import { sortByDate } from './helper';

// const sortedPost = sortByDate(posts);
// const sortedEnPost = sortByDate(enPosts);

// const sortedTranslations = sortByDate(translations);

const langPostMap = {
  ko: {
    posts,
  },
  en: {
    posts: enPosts,
  },
} satisfies Record<Language, { posts: Post[] }>;

/*
실제로 post, enPost, translations 등의 데이터를 사용하는 부분을 보면 정렬이 필요하지 않다. slug에 따라 데이터를 가져와서 정적 페이지를 생성할 뿐이다. 따라서 굳이 정렬할 필요도 없다.
*/

const langPostCache = {
  ko: new Map<string, Post>(),
  en: new Map<string, Post>(),
} satisfies Record<Language, Map<string, Post>>;

export const getPostBySlug = (slug: string, lang: Language = 'ko') => {
  if (langPostCache[lang].has(slug)) {
    return langPostCache[lang].get(slug);
  }
  langPostMap[lang].posts.forEach((post) => {
    langPostCache[lang].set(post.slug, post);
  });
  return langPostCache[lang].get(slug);
};

// 이후 필요하면 정렬
export const getSortedPosts = (lang: Language = 'ko') => {
  return sortByDate(langPostMap[lang].posts);
};

// 번역글은 언어에 상관 없음
export const getSortedTranslations = () => {
  return sortByDate(translations);
};
