import { Metadata } from 'next';

import { BlogConfigType } from '@/types/config';

export const blogConfig: BlogConfigType = {
  name:'김성현(Sung Hyun Kim)',
  title:'Witch-Work',
  description:
  '\"마녀\"라는 닉네임을 쓰는 프론트 개발자입니다. 여기서 제가 탐구하고 꿈꾸는 것들을 보여드릴 수 있어 영광입니다.',
  picture:'/witch.jpeg',
  pictureBlur:'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACwAQCdASoIAAYADMDOJQBdgB5P4BYAAP6ogcl9a+DLfk6FgAA=',
  url:'https://witch.work',
  social: {
    Github: 'https://github.com/witch-factory',
    BOJ: 'https://www.acmicpc.net/user/city'
  },
  comment: {
    type: 'giscus',
    repo: 'witch-factory/witch-next-blog',
    repoId: 'R_kgDOJnEDaQ',
    category: 'General',
    categoryId: 'DIC_kwDOJnEDac4CXFDt',
  },
  imageStorage: 'cloudinary',
  thumbnail: '/witch.jpeg',
  googleAnalyticsId:'G-HBQKJEYL1K'
};

export const SEOConfig: Metadata = {
  metadataBase: new URL(blogConfig.url),
  title: blogConfig.title,
  description: blogConfig.description,
  alternates:{
    canonical: blogConfig.url,
  },
  applicationName: blogConfig.title,
  referrer: 'origin-when-cross-origin',
  keywords:['Next.js', 'front', 'witch', 'blog', '김성현', '마녀', 'witch-work'],
  authors: [{ name: blogConfig.name, url: blogConfig.url }],
  publisher: blogConfig.name,
  creator: blogConfig.name,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: blogConfig.title,
    description: blogConfig.description,
    url: blogConfig.url,
    siteName: blogConfig.title,
    images: [
      {
        url :`${blogConfig.thumbnail}`,
        alt: `${blogConfig.name} 프로필 사진`,
      },
    ],
  },
  icons:{
    icon: '/witch-new-hat.svg',
    apple:'/witch-new-hat.png',
  }
};