import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { parsePage } from '@/utils/parsePage';
import { ITEMS_PER_PAGE, allPostNumber } from '@/utils/post';
import { getPostsByPage } from '@/utils/post';

type Props = {
  params: {
    page: string,
  },
};

function PostListPage({ params }: Props) {
  const currentPage = parsePage(params.page);

  if (currentPage === 1) {
    redirect('/posts/all');
  }

  if (currentPage > Math.ceil(allPostNumber / ITEMS_PER_PAGE)) {
    notFound();
  }

  const { pagePosts, totalPostNumber } = getPostsByPage({
    currentPage,
    postsPerPage: ITEMS_PER_PAGE,
  });

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, tags, url, thumbnail } = post;
    return { title, description, date, tags, url, thumbnail };
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

export default PostListPage;

export function generateStaticParams() {
  const paths = [];

  for (let i = 0; i < allPostNumber / ITEMS_PER_PAGE; i++) {
    paths.push({
      page: (i + 1).toString(),
    });
  }
  return paths;
}

export function generateMetadata({ params }: Props): Metadata {
  const currentPage = params.page;

  return {
    title: `${blogConfig.title}, All Posts ${currentPage} Page`,
    description: `${blogConfig.title}의 전체 글 중 ${currentPage}페이지 글 목록`,
    alternates: {
      canonical: `/posts/all/${currentPage}`,
    },
    openGraph: {
      title: `${blogConfig.title}, All Posts ${currentPage} Page`,
      description: `${blogConfig.title}의 전체 글 중 ${currentPage}페이지 글 목록`,
      url: `/posts/all/${currentPage}`,
    },
  };
}
