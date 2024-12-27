import { Metadata } from 'next';

import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { getPostsByPage, ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/post';

function PostListPage() {
  const currentPage = FIRST_PAGE;

  const { pagePosts, totalPostNumber } = getPostsByPage({
    currentPage: FIRST_PAGE,
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
        renderPageLink={(page: number) => `/posts/all/${page.toString()}`}
        perPage={ITEMS_PER_PAGE}
      />
      <PostList postList={pagePostsWithThumbnail} />
    </>
  );
}

const currentPage = FIRST_PAGE.toString();

export function generateMetadata(): Metadata {
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

export default PostListPage;
