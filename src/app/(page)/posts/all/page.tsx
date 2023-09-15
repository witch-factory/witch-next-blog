import { Metadata } from 'next';

import { CardProps } from '@/components/organisms/card';
import Pagination from '@/components/organisms/pagination';
import TagFilter from '@/components/organisms/tagFilter';
import PostList from '@/components/templates/postList';
import { makeTagURL } from '@/utils/makeTagURL';
import { PostType, getPostsByPage, ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';


function PostListPage() {
  const allTags = ['All', ...getAllPostTags()];
  const currentPage = FIRST_PAGE;

  const { pagePosts, totalPostNumber } = getPostsByPage({
    currentPage:FIRST_PAGE,
    postsPerPage:ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail: CardProps[] = pagePosts.map((post: PostType) => {
    const { title, description, date, tags, url } = post;
    const metadata = { title, description, date, tags, url };
    return 'thumbnail' in post._raw ? 
      ({ ...metadata, image: post._raw.thumbnail } as CardProps) :
      metadata;
  });

  return (
    <>
      <TagFilter
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
      canonical:`${blogConfig.url}/posts/all/${currentPage}`,
    },
    openGraph:{
      title: `${blogConfig.title}, All Posts ${currentPage} Page`,
      description: `${blogConfig.title}의 전체 글 중 ${currentPage}페이지 글 목록`,
      url:`${blogConfig.url}/posts/all/${currentPage}`,
    },
  };
}

export default PostListPage;
