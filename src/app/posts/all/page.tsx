import { Metadata } from 'next';

import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import PostTagFilter from '@/ui/postTagFilter';
import { makeTagURL } from '@/utils/makeTagURL';
import { PostType, getPostsByPage, ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/post';
import { getAllPostTags } from '@/utils/post';


function PostListPage() {
  const allTags = ['All', ...getAllPostTags()];
  const currentPage = FIRST_PAGE;

  const { pagePosts, totalPostNumber } = getPostsByPage({
    currentPage:FIRST_PAGE,
    postsPerPage:ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post: PostType) => {
    const { title, description, date, tags, url, thumbnail } = post;
    return { title, description, date, tags, url, thumbnail };
  });

  return (
    <>
      <PostTagFilter
        tags={allTags}
        selectedTag={'All'}
        makeTagURL={makeTagURL}
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

const currentPage = FIRST_PAGE;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${blogConfig.title}, All Posts ${currentPage} Page`,
    description: `${blogConfig.title}의 전체 글 중 ${currentPage}페이지 글 목록`,
    alternates:{
      canonical:`/posts/all/${currentPage}`,
    },
    openGraph:{
      title: `${blogConfig.title}, All Posts ${currentPage} Page`,
      description: `${blogConfig.title}의 전체 글 중 ${currentPage}페이지 글 목록`,
      url:`/posts/all/${currentPage}`,
    },
  };
}

export default PostListPage;
