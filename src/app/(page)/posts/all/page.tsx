import { Metadata } from 'next';

import { CardProps } from '@/components/organisms/card';
import Pagination from '@/components/pagination';
import TagFilter from '@/components/tagFilter';
import PostList from '@/components/templates/postList';
import { makeTagURL } from '@/utils/makeTagURL';
import { ITEMS_PER_PAGE } from '@/utils/post';
import { PostType, getPostsByPage } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';

export const FIRST_PAGE = 1;

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

export const metadata: Metadata = {
  title: '전체 글 목록',
  description: '전체 글 목록',
  alternates:{
    canonical:`${blogConfig.url}/posts/all`,
  },
  openGraph:{
    title: '전체 글',
    description: '전체 글',
    images: [
      {
        url:`${blogConfig.url}${blogConfig.thumbnail}`,
        alt: `${blogConfig.name} 프로필 사진`,
      },
    ],
    url:`${blogConfig.url}/posts/all`,
  },
};

export default PostListPage;
