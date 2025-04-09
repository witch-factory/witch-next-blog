import { postMetadata, enPostMetadata, translationsMetadata, PostMetadata, TranslationMetadata } from '#site/content';

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export const sortByDate = <T extends { date: string }>(data: T[]): T[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const sliceByPage = <T>(data: T[], page: number, itemsPerPage: number) =>
  data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

export function propsProperty(post: PostMetadata) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

export function propsPropertyTranslation(post: TranslationMetadata) {
  const { title, description, date, url } = post;
  return { title, description, date, url };
}

export function searchProperty(post: Omit<PostMetadata, 'tags'>) {
  const { title, description, date, url } = post;
  return { title, description, date, url };
}

// constants
// 페이지당 몇 개의 글이 보이는가
export const ITEMS_PER_PAGE = 10;
// 첫 번째 페이지
export const FIRST_PAGE = 1;

export const allPostNumber = postMetadata.length;
export const allEnPostNumber = enPostMetadata.length;
export const allTranslationNumber = translationsMetadata.length;
