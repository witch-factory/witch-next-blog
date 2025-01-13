import {
  postTags,
  enPostTags,
} from '#site/content';
import { Language } from '@/types/i18n';

const langTagsMap = {
  ko: {
    tags: postTags,
  },
  en: {
    tags: enPostTags,
  },
} satisfies Record<Language, object>;

// 태그의 slug를 받아서 해당 태그의 글 수를 반환
export const getPostCountByTag = (lang: Language, tagSlug: string) => {
  return langTagsMap[lang].tags.find((tag) => tag.slug === tagSlug)?.count ?? 0;
};

export const getAllPostTags = (lang: Language = 'ko') => {
  return langTagsMap[lang].tags.filter((tag) => tag.name !== 'All');
};
