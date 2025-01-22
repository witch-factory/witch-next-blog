import { Metadata } from 'next';

import { blogConfig } from '@/config/blogConfig';
import { Locale } from '@/types/i18n';

// 언어가 추가될 때마다 새로운 메타데이터 객체를 추가
export function generatePostsPageMetadata(lang: Locale, currentPage: number, tag: string): Metadata {
  const koTitle = `${blogConfig[lang].title}, ${tag === 'all' ? '모든' : tag} 글 ${currentPage}페이지`;
  const koDescription = `${blogConfig[lang].title}의 ${tag === 'all' ? '전체' : tag} 글 목록 ${currentPage}페이지`;

  const enTitle = `${blogConfig[lang].title}, ${tag === 'all' ? 'All' : tag} Posts ${currentPage} Page`;
  const enDescription = `${blogConfig[lang].title}, ${tag === 'all' ? 'All' : tag} Posts ${currentPage} Page`;

  switch (lang) {
    case 'ko':
      return {
        title: koTitle,
        description: koDescription,
        alternates: {
          canonical: `/posts/${tag === 'all' ? '' : 'tag/'}${tag}/${currentPage}`,
        },
        openGraph: {
          type: 'website',
          locale: 'ko_KR',
          title: koTitle,
          description: koDescription,
          url: `/posts/${tag}/${currentPage}`,
          images: [
            {
              url: blogConfig.ko.thumbnail,
              alt: `${blogConfig.ko.name} 프로필 사진`,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          site: '@witch_front',
          creator: '@witch_front',
          title: koTitle,
          description: koDescription,
          images: [
            {
              url: blogConfig.ko.thumbnail,
              alt: `${blogConfig.ko.name} 프로필 사진`,
            },
          ],
        },
      };
    case 'en':
      return {
        title: enTitle,
        description: enDescription,
        alternates: {
          canonical: `/en/posts/${tag === 'all' ? '' : 'tag/'}${tag}/${currentPage}`,
        },
        openGraph: {
          type: 'website',
          locale: 'en_US',
          title: enTitle,
          description: enDescription,
          url: `/en/posts/${tag}/${currentPage}`,
          images: [
            {
              url: blogConfig.ko.thumbnail,
              alt: `${blogConfig.ko.name} 프로필 사진`,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          site: '@witch_front',
          creator: '@witch_front',
          title: enTitle,
          description: enDescription,
          images: [
            {
              url: blogConfig.en.thumbnail,
              alt: `${blogConfig.en.name} profile picture`,
            },
          ],
        },
      };
  }
}
