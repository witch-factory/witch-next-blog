import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CardProps } from '@/components/organisms/card';
import Pagination from '@/components/organisms/pagination';
import TagFilter from '@/components/organisms/tagFilter';
import PostList from '@/components/templates/postList';
import { makeTagURL } from '@/utils/makeTagURL';
import { PostType, getPostsByPageAndTag, ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';


type Props={
  params: {tag: string}
};

function PostListPage({ params }: Props) {
  const tag = params.tag;
  const tagURL = `/posts/tag/${tag}`;
  const allTags = ['All', ...getAllPostTags()];
  const currentPage = FIRST_PAGE;

  if (!allTags.includes(tag)) {
    notFound();
  }

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

const currentPage = FIRST_PAGE;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = params.tag;
  const tagURL = `/posts/tag/${tag}`;

  return {
    title: `${blogConfig.title}, ${tag} Posts ${currentPage} Page`,
    description: `${blogConfig.title}의 ${tag} 글 중 ${currentPage}페이지 글 목록`,
    alternates:{
      canonical:`${tagURL}`,
    },
    openGraph:{
      title: `${blogConfig.title}, ${tag} Posts ${currentPage} Page`,
      description: `${blogConfig.title}의 ${tag} 글 중 ${currentPage}페이지 글 목록`,
      url:`${tagURL}`,
    },
  };
}