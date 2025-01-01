import { Metadata } from 'next';

import { blogConfig } from '@/config/blogConfig';
import { Language } from '@/types/i18n';

// 언어가 추가될 때마다 새로운 메타데이터 객체를 추가
export function generatePostsPageMetadata(lang: Language, currentPage: number, tag: string): Metadata {
  switch (lang) {
    case 'ko':
      return {
        title: `${blogConfig[lang].title}, ${tag === 'all' ? '모든' : tag} 글 ${currentPage}페이지`,
        description: `${blogConfig[lang].title}의 ${tag === 'all' ? '전체' : tag} 글 목록 ${currentPage}페이지`,
        alternates: {
          canonical: `/posts/${tag === 'all' ? '' : 'tag/'}${tag}/${currentPage}`,
        },
        openGraph: {
          title: `${blogConfig[lang].title}, ${tag === 'all' ? '모든' : tag} 글 ${currentPage}페이지`,
          description: `${blogConfig[lang].title}의 ${tag === 'all' ? '전체' : tag} 글 목록 ${currentPage}페이지`,
          url: `/posts/${tag}/${currentPage}`,
        },
      };
    case 'en':
      return {
        title: `${blogConfig[lang].title}, ${tag === 'all' ? 'All' : tag} Posts ${currentPage} Page`,
        description: `${blogConfig[lang].title}, ${tag === 'all' ? 'All' : tag} Posts ${currentPage} Page`,
        alternates: {
          canonical: `/posts/${tag === 'all' ? '' : 'tag/'}${tag}/${currentPage}`,
        },
        openGraph: {
          title: `${blogConfig[lang].title}, All Posts ${currentPage} Page`,
          description: `${blogConfig[lang].title}, All Posts ${currentPage} Page`,
          url: `/posts/${tag}/${currentPage}`,
        },
      };
  }
}
