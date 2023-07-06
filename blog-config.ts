import { NextSeoProps } from 'next-seo';

interface BlogConfigType {
  name: string; // used for footer and RSS feed
  title: string;
  description: string;
  picture: string;
  url: string;
  social: {
    Github: string;
    BOJ: string;
  };
  comment: {
      type: 'giscus';
      repo: string;
      repoId: string;
      category: string;
      categoryId: string;
      lang?: 'ko' | 'en'; // defaults to 'en'
      lazy?: boolean;
    };
  imageStorage: 'local' | 'cloudinary'; // defaults to 'local'
  thumbnail: string;
  googleAnalyticsId?: string; // gtag id
}

const blogConfig: BlogConfigType = {
  name:'김성현(Sung Hyun Kim)',
  title:'Witch-Work',
  description:
    '대단한 뜻을 품고 사는 사람은 아닙니다. ' +
    '그저 멋진 사람들이 내는 빛을 따라가다 보니 여기까지 왔고, ' +
    '앞으로도 그렇게 살 수 있었으면 좋겠다고 생각하는 사람입니다. ' +
    '이곳에 찾아오신 당신과도 함께할 수 있어 영광입니다. ' +
    '`마녀`라는 닉네임을 주로 씁니다.',
  picture:'/witch-new.png',
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

export const SEOConfig: NextSeoProps = {
  title: blogConfig.title,
  description: blogConfig.description,
  canonical: blogConfig.url,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: blogConfig.title,
    description: blogConfig.description,
    url: blogConfig.url,
    siteName: blogConfig.title,
    images: [
      {
        url :`${blogConfig.url}${blogConfig.thumbnail}`,
        alt: `${blogConfig.name} 프로필 사진`,
      },
    ],
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/witch-hat.svg',
    },
    {
      rel: 'mask-icon',
      href: '/witch-hat.svg',
      color: '#000000'
    },
    {
      rel: 'apple-touch-icon',
      href: '/witch-hat.png',
    }
  ]
};

export default blogConfig;