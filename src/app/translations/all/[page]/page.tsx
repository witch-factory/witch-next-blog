import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE, allTranslationNumber, getTranslationsByPage } from '@/utils/post';

type Props = {
  params: {
    page: string,
  },
};

function TranslationListPage({ params }: Props) {
  const currentPage = Number(params.page) ?? 1;

  if (currentPage === 1) {
    redirect('/translations/all');
  }

  if (currentPage > Math.ceil(allTranslationNumber / ITEMS_PER_PAGE)) {
    notFound();
  }

  const { pagePosts, totalPostNumber } = getTranslationsByPage({
    currentPage,
    postsPerPage: ITEMS_PER_PAGE,
  });

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, url, thumbnail } = post;
    return { title, description, date, url, thumbnail };
  });

  return (
    <>
      <AllPostTagFilter
        selectedTag="all"
      />
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `/posts/all/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
      <PostList postList={pagePostsWithThumbnail} />
    </>
  );
}

export default TranslationListPage;

export function generateStaticParams() {
  const paths = [];

  for (let i = 0; i < allTranslationNumber / ITEMS_PER_PAGE; i++) {
    paths.push({
      page: (i + 1).toString(),
    });
  }
  return paths;
}

export function generateMetadata({ params }: Props): Metadata {
  const currentPage = params.page;

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
