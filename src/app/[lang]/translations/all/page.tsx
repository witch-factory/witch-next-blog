import { Metadata } from 'next';

import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import { Language, locales } from '@/types/i18n';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/content/helper';
import { getSortedTranslationsMetadatas } from '@/utils/content/postMetadata';

type Props = {
  params: { lang: Language },
};

const content = {
  ko: {
    title: '번역한 글',
    description: '재미있게 읽은 글들을 한국어로 번역합니다.',
  },
  en: {
    title: 'Translations',
    description: 'I translate articles that I found interesting into Korean.',
  },
} as const satisfies Record<Language, object>;

function TranslationListPage({ params }: Props) {
  const { lang } = params;
  const currentPage = FIRST_PAGE;

  const pagePosts = getSortedTranslationsMetadatas();
  const totalPostNumber = pagePosts.length;

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, url, thumbnail } = post;
    return { title, description, date, url, thumbnail };
  });

  return (
    <>
      <h2 className="title">{content[lang].title}</h2>
      <p>
        {content[lang].description}
      </p>
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `/translations/all/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
      <PostList postList={pagePostsWithThumbnail} />
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `/translations/all/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
    </>
  );
}

const currentPage = FIRST_PAGE;

export function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }));
}

// 번역 글이니까 한국어만 있으면 됨...
export function generateMetadata(): Metadata {
  return {
    title: `${blogConfig.ko.title}, 번역 글 목록`,
    description: `${blogConfig.ko.title}의 번역 글 목록 ${currentPage}페이지`,
    alternates: {
      canonical: `/translations/all/${currentPage}`,
    },
    openGraph: {
      title: `${blogConfig.ko.title}, 번역 글 목록`,
      description: `${blogConfig.ko.title}의 번역 글 목록 ${currentPage}페이지`,
      url: `/translations/all/${currentPage}`,
    },
  };
}

export default TranslationListPage;
