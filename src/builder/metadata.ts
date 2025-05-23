// 메타데이터를 생성하는 데에 쓰는 헬퍼 함수들
// 각종 메타데이터 공통 설정 등을 관리

import { Metadata } from 'next';

import { PostMetadata } from '#site/content';
import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/constants/i18n';
import { BlogCommonConfigType, BlogConfigType } from '@/types/config';

type MetaCardData = {
  title: string,
  description: string,
  url: string,
  thumbnail?: {
    local: string,
    cloud?: string,
  },
};

const processThumbnail = (thumbnail: MetaCardData['thumbnail'], imageStorage: BlogCommonConfigType['imageStorage']) => {
  if (!thumbnail) return blogConfig.thumbnail[imageStorage];
  return thumbnail[imageStorage] ?? thumbnail.local;
};

const buildOpenGraphMetadata = (data: MetaCardData, locale: Locale, imageStorage: BlogCommonConfigType['imageStorage']): Metadata['openGraph'] => {
  return {
    type: 'website',
    locale: locale === 'ko' ? 'ko_KR' : 'en_US',
    title: data.title,
    description: data.description,
    url: data.url,
    images: [
      {
        url: processThumbnail(data.thumbnail, imageStorage),
        width: 300,
        height: 200,
        alt: `${data.title} thumbnail`,
      },
    ],
  };
};

const buildTwitterMetadata = (data: MetaCardData, imageStorage: BlogCommonConfigType['imageStorage']): Metadata['twitter'] => {
  return {
    card: 'summary_large_image',
    site: '@witch_front',
    creator: '@witch_front',
    title: data.title,
    description: data.description,
    images: [
      {
        url: processThumbnail(data.thumbnail, imageStorage),
        alt: `${data.title} thumbnail`,
      },
    ],
  };
};

export const generateBlogLocalMetadata = (config: BlogConfigType, locale: Locale): Metadata => {
  return {
    metadataBase: new URL(config[locale].baseUrl),
    title: config[locale].title,
    description: config[locale].description,
    alternates: {
      // 대표 URL은 언어의 기본 URL로 설정
      canonical: config[locale].url,
      languages: {
        'x-default': config[locale].baseUrl,
        'ko': config.ko.url,
        'en': config.en.url,
      },
    },
    applicationName: config[locale].title,
    referrer: 'origin-when-cross-origin',
    keywords: ['Next.js', 'front', 'witch', 'blog', config[locale].name, 'witch-work', '김성현', '마녀'],
    authors: [{ name: config[locale].name, url: config[locale].url }],
    publisher: config[locale].name,
    creator: config[locale].name,
    category: 'technology',
    openGraph: {
      ...buildOpenGraphMetadata(config[locale], locale, config[locale].imageStorage),
      siteName: config[locale].title,
    },
    twitter: buildTwitterMetadata(config[locale], config[locale].imageStorage),
    icons: {
      icon: '/witch-new-hat.svg',
      apple: '/witch-new-hat.png',
    },
  };
};

export const generatePostPageMetadata = (config: BlogConfigType, locale: Locale, post: Omit<PostMetadata, 'tags'>): Metadata => {
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${locale}${post.url}`,
      languages: {
        'x-default': post.url,
        'ko': `/ko${post.url}`,
        'en': `/en${post.url}`,
      },
    },
    openGraph: buildOpenGraphMetadata(post, locale, config[locale].imageStorage),
    twitter: buildTwitterMetadata(post, config[locale].imageStorage),
  };
};

// 언어가 추가될 때마다 새로운 메타데이터 객체를 추가
export function generatePostListPageMetadata(locale: Locale, page: number, tag: string): Metadata {
  const config = blogLocalConfig[locale];
  const isTagAll = tag === 'all';
  const pagePath = `/posts/tag/${tag}/${page === 1 ? '' : page}`;

  const title = locale === 'ko'
    ? `${config.title}, ${isTagAll ? '전체' : tag} 글 ${page}페이지`
    : `${config.title}, ${isTagAll ? 'All' : tag} Posts ${page} Page`;

  const description = locale === 'ko'
    ? `${config.title}의 ${isTagAll ? '전체' : tag} 글 목록 ${page}페이지`
    : `${config.title}, ${isTagAll ? 'All' : tag} Posts ${page} Page`;

  const metaCard: MetaCardData = {
    title,
    description,
    url: `/${locale}${pagePath}`,
    thumbnail: config.thumbnail,
  };

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${pagePath}`,
      languages: {
        'x-default': pagePath,
        'ko': `/ko${pagePath}`,
        'en': `/en${pagePath}`,
      },
    },
    openGraph: buildOpenGraphMetadata(metaCard, locale, config.imageStorage),
    twitter: buildTwitterMetadata(metaCard, config.imageStorage),
  };
}
