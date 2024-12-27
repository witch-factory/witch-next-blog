import { Metadata } from 'next';

import { translationsMetadata } from '#site/content';
import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE, FIRST_PAGE, getSortedTranslationsMetadatas } from '@/utils/post';

function TranslationListPage() {
  const currentPage = FIRST_PAGE;

  const pagePosts = getSortedTranslationsMetadatas();
  const totalPostNumber = translationsMetadata.length;

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, url, thumbnail } = post;
    return { title, description, date, url, thumbnail };
  });

  return (
    <>
      <h2 className="title">번역한 글</h2>
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `/translations/all/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
      <PostList postList={pagePostsWithThumbnail} />
    </>
  );
}

const currentPage = FIRST_PAGE;

export function generateMetadata(): Promise<Metadata> {
  return {
    title: `${blogConfig.title}, 번역 글 목록`,
    description: `${blogConfig.title}의 번역 글 목록 ${currentPage}페이지`,
    alternates: {
      canonical: `/translations/all/${currentPage}`,
    },
    openGraph: {
      title: `${blogConfig.title}, 번역 글 목록`,
      description: `${blogConfig.title}의 번역 글 목록 ${currentPage}페이지`,
      url: `/translations/all/${currentPage}`,
    },
  };
}

export default TranslationListPage;
