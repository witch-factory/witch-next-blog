import { Metadata } from 'next';

import { blogLocalConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import { i18n, Locale } from '@/types/i18n';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/content/helper';
import { getSortedTranslationsMetadatas } from '@/utils/content/postMetadata';

type Props = {
  params: Promise<{ lang: Locale }>,
};

async function TranslationListPage({ params }: Props) {
  const { lang } = await params;
  const currentPage = FIRST_PAGE;

  const pagePosts = getSortedTranslationsMetadatas();
  const totalPostNumber = pagePosts.length;

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, url, thumbnail } = post;
    return { title, description, date, url, thumbnail };
  });

  return (
    <>
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `/translations/all/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
      <PostList lang={lang} posts={pagePostsWithThumbnail} />
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
  return i18n.locales.map((lang) => ({
    lang,
  }));
}

// 번역 글이니까 한국어만 있으면 됨...
export function generateMetadata(): Metadata {
  return {
    title: `${blogLocalConfig.ko.title}, 번역 글 목록`,
    description: `${blogLocalConfig.ko.title}의 번역 글 목록 ${currentPage}페이지`,
    alternates: {
      canonical: `/translations/all/${currentPage}`,
    },
    openGraph: {
      title: `${blogLocalConfig.ko.title}, 번역 글 목록`,
      description: `${blogLocalConfig.ko.title}의 번역 글 목록 ${currentPage}페이지`,
      url: `/translations/all/${currentPage}`,
    },
  };
}

export default TranslationListPage;
