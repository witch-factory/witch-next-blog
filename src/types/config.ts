import { Language } from './i18n';

export type BlogCategoryType = {
  title: string,
  url: string,
};

export type BlogLocalConfigType = {
  name: string,
  email: string,
  title: string,
  description: string,
  picture: string,
  pictureBlur?: string,
  url: string,
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
  thumbnail: string,
  googleAnalyticsId?: string,
};

export type BlogConfigType = Record<Language, BlogLocalConfigType>;

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
