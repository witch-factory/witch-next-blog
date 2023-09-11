import { CardProps } from '@/components/card';
import Pagination from '@/components/pagination';
import PostList from '@/components/postList';
import TagFilter from '@/components/tagFilter';
import { makeTagURL } from '@/utils/makeTagURL';
import { getPostsByPageAndTag } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';
import { DocumentTypes } from 'contentlayer/generated';

import { ITEMS_PER_PAGE } from './[page]';

type Props={
  params: {tag: string}
};

const FIRST_PAGE = 1;

function PostListPage({ params }: Props) {

  const tag = params.tag;
  const tagURL = `/posts/tag/${tag}`;
  const allTags = ['All', ...getAllPostTags()];
  const currentPage = FIRST_PAGE;

  const { pagePosts, totalPostNumber } = getPostsByPageAndTag({
    tag:params.tag,
    currentPage:FIRST_PAGE,
    postsPerPage:ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail = pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata = { title, description, date, tags, url };
    return 'thumbnail' in post._raw ? 
      ({ ...metadata, thumbnail: post._raw.thumbnail } as CardProps) :
      metadata;
  });

  return (
    <>
      <TagFilter
        tags={allTags}
        selectedTag={tag}
        makeTagURL={makeTagURL}
      />
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `${tagURL}/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
      <PostList postList={pagePostsWithThumbnail} />
    </>
  );
}

export default PostListPage;

export const generateStaticParams = ()=>{
  const paths = getAllPostTags();
  return paths;
};

export async function generateMetadata({ params }: Props) {
  const tag = params.tag;
  const tagURL = `/posts/tag/${tag}`;

  return {
    title: `Post tag : ${tag}`,
    description: `${tag} 태그를 가진 글 목록`,
    canonical:`${blogConfig.url}${tagURL}`,
    openGraph:{
      title: `Post tag : ${tag}`,
      description: `${tag} 태그를 가진 글 목록`,
      images: [
        {
          url:`${blogConfig.url}${blogConfig.thumbnail}`,
          alt: `${blogConfig.name} 프로필 사진`,
        },
      ],
      url:`${blogConfig.url}${tagURL}`,
    },
  };
}