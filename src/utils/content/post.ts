import {
  posts,
  translations,
  enPosts,
  Post,
} from '#site/content';
import { Language } from '@/types/i18n';

import { sortByDate } from './helper';

const sortedPost = sortByDate(posts);
const sortedEnPost = sortByDate(enPosts);

const sortedTranslations = sortByDate(translations);

const langPostMap = {
  ko: {
    posts: sortedPost,
  },
  en: {
    posts: sortedEnPost,
  },
} satisfies Record<Language, { posts: Post[] }>;

export const getSortedPosts = (lang: Language = 'ko') => {
  return langPostMap[lang].posts;
};

// 번역글은 언어에 상관 없음
export const getSortedTranslations = () => {
  return sortedTranslations;
};
