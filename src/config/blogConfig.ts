import { Metadata } from 'next';

import { BlogConfigType } from '@/types/config';

export const blogConfig: BlogConfigType = {
  name:'김성현(Sung Hyun Kim)',
  title:'Witch-Work',
  description:
  '\"마녀\"라는 닉네임을 쓰는 프론트 개발자입니다. 완벽한 사람은 아닙니다. 하지만 제가 걸어온 길을 사랑한다고 단 한순간도 망설이지 않고 말할 수 있습니다. 이곳에 찾아와주신 당신께도 제가 사랑하는 것들을 보여드릴 수 있어 영광입니다.',
  picture:'/witch.jpeg',
  pictureBlur:'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACwAQCdASoIAAYADMDOJQBdgB5P4BYAAP6ogcl9a+DLfk6FgAA=',
  url:'https://witch.work',
  social: {
    GitHub: 'https://github.com/witch-factory',
    BOJ: 'https://www.acmicpc.net/user/city'
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