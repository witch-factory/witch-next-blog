import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { getPostsByPageAndTag, ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/post';
import { getAllPostTags } from '@/utils/post';

type Props = {
  params: {
    tag: string,
  }
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

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, tags, url, thumbnail } = post;
    return { title, description, date, tags, url, thumbnail };
  });

  return (
    <>
      <AllPostTagFilter
        selectedTag={tag}
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