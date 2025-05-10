// 메타데이터를 생성하는 데에 쓰는 헬퍼 함수들
// 각종 메타데이터 공통 설정 등을 관리

import { Metadata } from 'next';

import { PostMetadata } from '#site/content';
import { blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/constants/i18n';
import { BlogConfigType } from '@/types/config';

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
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      title: config[locale].title,
      description: config[locale].description,
      url: config[locale].url,
      siteName: config[locale].title,
      images: [
        {
          url: config[locale].thumbnail,
          alt: `${config[locale].name} profile picture`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@witch_front',
      creator: '@witch_front',
      title: config[locale].title,
      description: config[locale].description,
      images: [
        {
          url: config[locale].thumbnail,
          alt: `${config[locale].name} profile picture`,
        },
      ],
    },
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
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.url,
      images: [{
        url: post.thumbnail?.[config[locale].imageStorage] ?? config[locale].thumbnail,
        width: 300,
        height: 200,
        alt: `${post.title} thumbnail`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@witch_front',
      creator: '@witch_front',
      title: post.title,
      description: post.description,
      images: [
        {
          url: post.thumbnail?.[config[locale].imageStorage] ?? config[locale].thumbnail,
          alt: `${post.title} thumbnail`,
        },
      ],
    },
  };
};

// 언어가 추가될 때마다 새로운 메타데이터 객체를 추가
export function generatePostListPageMetadata(lang: Locale, currentPage: number, tag: string): Metadata {
  const baseTitle = blogLocalConfig[lang].title;
  const baseDescription = blogLocalConfig[lang].title;

  const localTitle: Record<Locale, string> = {
    ko: `${baseTitle}, ${tag === 'all' ? '모든' : tag} 글 ${currentPage}페이지`,
    en: `${baseTitle}, ${tag === 'all' ? 'All' : tag} Posts ${currentPage} Page`,
  };
  const localDescription: Record<Locale, string> = {
    ko: `${baseDescription}의 ${tag === 'all' ? '전체' : tag} 글 목록 ${currentPage}페이지`,
    en: `${baseDescription}, ${tag === 'all' ? 'All' : tag} Posts ${currentPage} Page`,
  };
  return {
    title: localTitle[lang],
    description: localDescription[lang],
    alternates: {
      canonical: `/${lang}/posts/tag/${tag}/${currentPage === 1 ? '' : currentPage}`,
      languages: {
        'x-default': `/posts/tag/${tag}/${currentPage === 1 ? '' : currentPage}`,
        'ko': `/ko/posts/tag/${tag}/${currentPage === 1 ? '' : currentPage}`,
        'en': `/en/posts/tag/${tag}/${currentPage === 1 ? '' : currentPage}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
      title: localTitle[lang],
      description: localDescription[lang],
      url: `/${lang}/posts/tag/${tag}/${currentPage === 1 ? '' : currentPage}`,
      images: [
        {
          url: blogLocalConfig[lang].thumbnail,
          alt: `${blogLocalConfig[lang].name} profile picture`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@witch_front',
      creator: '@witch_front',
      title: localTitle[lang],
      description: localDescription[lang],
      images: [
        {
          url: blogLocalConfig[lang].thumbnail,
          alt: `${blogLocalConfig[lang].name} profile picture`,
        },
      ],
    },
  };
}
