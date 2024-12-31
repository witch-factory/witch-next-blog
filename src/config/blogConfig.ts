import { Metadata } from 'next';

import { BlogConfigType, BlogLocalConfigType } from '@/types/config';
import { Language } from '@/types/i18n';

const pictureURL = '/witch.jpeg';
const pictureBlurURL = 'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACwAQCdASoIAAYADMDOJQBdgB5P4BYAAP6ogcl9a+DLfk6FgAA=';
const githubURL = 'https://github.com/witch-factory';
const bojURL = 'https://www.acmicpc.net/user/city';
const commentObject: BlogLocalConfigType['comment'] = {
  type: 'giscus',
  repo: 'witch-factory/witch-next-blog',
  repoId: 'R_kgDOJnEDaQ',
  category: 'General',
  categoryId: 'DIC_kwDOJnEDac4CXFDt',
};
const imageStorage = 'local';
const thumbnailURL = '/witch.jpeg';
const googleAnalyticsId = 'G-HBQKJEYL1K';

export const blogConfig: BlogConfigType = {
  ko: {
    name: '김성현',
    email: 'soakdma37@gmail.com',
    title: 'Witch-Work, 마녀 작업실',
    description: '\"마녀\"라는 닉네임을 쓰는 프론트 개발자입니다. 완벽한 사람은 아닙니다. 하지만 제가 걸어온 길을 사랑한다고 단 한순간도 망설이지 않고 말할 수 있습니다. 이곳에 찾아와주신 당신께도 제가 사랑하는 것들을 보여드릴 수 있어 영광입니다.',
    picture: pictureURL,
    pictureBlur: pictureBlurURL,
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://witch.work',
    social: {
      About: '/about',
      GitHub: githubURL,
      BOJ: bojURL,
    },
    comment: {
      ...commentObject,
      lang: 'ko',
    },
    imageStorage,
    thumbnail: thumbnailURL,
    googleAnalyticsId,
  },
  en: {
    name: 'Sung Hyun Kim',
    email: 'soakdma37@gmail.com',
    title: 'Witch-Work, the witchcraft',
    description: 'I am a frontend developer who goes by the nickname \"Witch.\" I am not a perfect person, but I can say without a moment\'s hesitation that I love the path I\'ve walked. It is an honor to share with you the things I hold dear, and I am grateful that you\'ve visited this space.',
    picture: pictureURL,
    pictureBlur: pictureBlurURL,
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/en' : 'https://witch.work/en',
    social: {
      About: '/en/about',
      GitHub: githubURL,
      BOJ: bojURL,
    },
    comment: {
      ...commentObject,
      lang: 'en',
    },
    imageStorage,
    thumbnail: thumbnailURL,
    googleAnalyticsId,
  },
};

export const SEOConfig: Record<Language, Metadata> = {
  ko: {
    metadataBase: new URL(blogConfig.ko.url),
    title: blogConfig.ko.title,
    description: blogConfig.ko.description,
    alternates: {
      canonical: blogConfig.ko.url,
    },
    applicationName: blogConfig.ko.title,
    referrer: 'origin-when-cross-origin',
    keywords: ['Next.js', 'front', 'witch', 'blog', '김성현', '마녀', 'witch-work'],
    authors: [{ name: blogConfig.ko.name, url: blogConfig.ko.url }],
    publisher: blogConfig.ko.name,
    creator: blogConfig.ko.name,
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      title: blogConfig.ko.title,
      description: blogConfig.ko.description,
      url: blogConfig.ko.url,
      siteName: blogConfig.ko.title,
      images: [
        {
          url: blogConfig.ko.thumbnail,
          alt: `${blogConfig.ko.name} 프로필 사진`,
        },
      ],
    },
    icons: {
      icon: '/witch-new-hat.svg',
      apple: '/witch-new-hat.png',
    },
  },
  en: {
    metadataBase: new URL(blogConfig.en.url),
    title: blogConfig.en.title,
    description: blogConfig.en.description,
    alternates: {
      canonical: blogConfig.en.url,
    },
    applicationName: blogConfig.en.title,
    referrer: 'origin-when-cross-origin',
    keywords: ['Next.js', 'front', 'witch', 'blog', 'Sung Hyun Kim', 'witch-work'],
    authors: [{ name: blogConfig.en.name, url: blogConfig.en.url }],
    publisher: blogConfig.en.name,
    creator: blogConfig.en.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      title: blogConfig.en.title,
      description: blogConfig.en.description,
      url: blogConfig.en.url,
      siteName: blogConfig.en.title,
      images: [
        {
          url: blogConfig.en.thumbnail,
          alt: `${blogConfig.en.name} profile picture`,
        },
      ],
    },
    icons: {
      icon: '/witch-new-hat.svg',
      apple: '/witch-new-hat.png',
    },
  },
};
