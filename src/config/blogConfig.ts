import { BlogCommonConfigType, BlogConfigType } from '@/types/config';

export const blogConfig: BlogCommonConfigType = {
  email: 'soakdma37@gmail.com',
  picture: '/witch.jpeg',
  pictureBlur: 'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACwAQCdASoIAAYADMDOJQBdgB5P4BYAAP6ogcl9a+DLfk6FgAA=',
  baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://witch.work',
  social: {
    About: '/about',
    GitHub: 'https://github.com/witch-factory',
    BOJ: 'https://www.acmicpc.net/user/city',
  },
  comment: {
    type: 'giscus',
    repo: 'witch-factory/witch-next-blog',
    repoId: 'R_kgDOJnEDaQ',
    category: 'General',
    categoryId: 'DIC_kwDOJnEDac4CXFDt',
  },
  imageStorage: 'cloud',
  thumbnail: '/witch.jpeg',
  googleAnalyticsId: 'G-HBQKJEYL1K',
};

export const blogLocalConfig: BlogConfigType = {
  ko: {
    ...blogConfig,
    name: '김성현',
    title: 'Witch-Work, 마녀 작업실',
    description: '\"마녀\"라는 닉네임을 쓰는 프론트 개발자입니다. 완벽한 사람은 아닙니다. 하지만 제가 걸어온 길을 사랑한다고 단 한순간도 망설이지 않고 말할 수 있습니다. 이곳에 찾아와주신 당신께도 제가 사랑하는 것들을 보여드릴 수 있어 영광입니다.',
    url: `${blogConfig.baseUrl}/ko`,
    comment: {
      ...blogConfig.comment,
      lang: 'ko',
    },
  },
  en: {
    ...blogConfig,
    name: 'Sung Hyun Kim',
    title: 'Witch-Work, The Witchcraft',
    description: 'I am a frontend developer who goes by the nickname \"Witch.\" I am not a perfect person, but I can say without a moment\'s hesitation that I love the path I\'ve walked. It is an honor to share with you the things I hold dear, and I am grateful that you\'ve visited this space.',
    url: `${blogConfig.baseUrl}/en`,
    comment: {
      ...blogConfig.comment,
      lang: 'en',
    },
  },
};
