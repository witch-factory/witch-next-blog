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
    description: '\"마녀\"라는 닉네임을 쓰는 프론트 개발자입니다. 제가 보았던 가장 멋진 사람들을 따라 개발자가 되었습니다. 그들과 함께 걷다 보니 어느새 여기까지 왔습니다. 이곳에 찾아오신 당신과도 함께할 수 있어 영광입니다.',
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
    description: 'A frontend developer who goes by the nickname \"Witch\". I became a developer by following the coolest people I\'ve ever met. Walking beside them, I\'ve come a long way. And now, I\'m truly honored to share this part of the journey with you.',
    url: `${blogConfig.baseUrl}/en`,
    comment: {
      ...blogConfig.comment,
      lang: 'en',
    },
  },
};
