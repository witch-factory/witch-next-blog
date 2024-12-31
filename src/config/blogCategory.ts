import { BlogCategoryType } from '@/types/config';

const blogCategoryList: BlogCategoryType[] = [
  { title: '작성글', url: '/posts/all' },
  { title: '번역', url: '/translations/all' },
];

const enBlogCategoryList: BlogCategoryType[] = [
  { title: 'Posts', url: '/en/posts/all' },
  { title: 'Transl.', url: '/en/translations/all' },
];

export const blogCategory = {
  ko: blogCategoryList,
  en: enBlogCategoryList,
};
