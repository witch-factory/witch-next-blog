import { Locale } from '@/constants/i18n';

export type BlogCategoryType = {
  title: string,
  url: string,
};

export type BlogCommonConfigType = {
  email: string,
  picture: string,
  pictureBlur?: string,
  baseUrl: string,
  social: {
    About: string,
    GitHub: string,
    BOJ: string,
  },
  comment: {
    type: 'giscus' | 'utterances',
    repo: string,
    repoId: string,
    category: string,
    categoryId: string,
    lang?: 'ko' | 'en', // defaults to 'en'
    lazy?: boolean,
  },
  imageStorage: 'local' | 'cloud', // defaults to 'local'
  thumbnail: {
    local: string,
    cloud: string,
  },
  googleAnalyticsId?: string,
};

export type BlogLocalConfigType = BlogCommonConfigType & {
  name: string,
  title: string,
  description: string,
  url: string,
};

export type BlogConfigType = Record<Locale, BlogLocalConfigType>;

export type BlogProjectType = {
  title: string,
  description: string,
  image: {
    local: string,
    cloud: string,
    blurURL?: string,
  },
  url: string,
  tags: string[],
};
