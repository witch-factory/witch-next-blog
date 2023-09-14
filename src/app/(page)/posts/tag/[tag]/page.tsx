import { Metadata } from 'next';

import { CardProps } from '@/components/card';
import Pagination from '@/components/pagination';
import TagFilter from '@/components/tagFilter';
import PostList from '@/components/templates/postList';
import { makeTagURL } from '@/utils/makeTagURL';
import { PostType, getPostsByPageAndTag } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';

import { ITEMS_PER_PAGE } from './[page]/page';

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

  const pagePostsWithThumbnail = pagePosts.map((post: PostType) => {
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
  const paths = getAllPostTags().map((tag: string)=>{
    return { tag };
  });
  return paths;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = params.tag;
  const tagURL = `/posts/tag/${tag}`;

  return {
    title: `Post tag : ${tag}`,
    description: `${tag} 태그를 가진 글 목록`,
    alternates:{
      canonical:`${blogConfig.url}${tagURL}`,
    },
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