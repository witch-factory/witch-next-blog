import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import ArticleTagFilter from '@/ui/postTagFilter';
import { makeTagURL } from '@/utils/makeTagURL';
import { ITEMS_PER_PAGE, allPostNumber } from '@/utils/post';
import { PostType, getPostsByPage } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';


type Props={
  params: {page: string}
};

function PostListPage({ params }: Props) {
  const currentPage = Number(params.page) ?? 1;
  const allTags = ['All', ...getAllPostTags()];

  if (currentPage === 1) {
    redirect('/posts/all');
  }

  if (currentPage > Math.ceil(allPostNumber / ITEMS_PER_PAGE)) {
    notFound();
  }

  const { pagePosts, totalPostNumber } = getPostsByPage({
    currentPage,
    postsPerPage:ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post: PostType) => {
    const { title, description, date, tags, url, thumbnail } = post;
    return { title, description, date, tags, url, thumbnail };
  });


  return (
    <>
      <ArticleTagFilter
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

export default PostListPage;

export function generateStaticParams() {
  const paths = [];

  const tags = getAllPostTags();

  for (const tag of tags) {
    for (let i = 0;i < allPostNumber / ITEMS_PER_PAGE;i++) {
      paths.push({
        tag,
        page: (i + 1).toString(),
      });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const currentPage = params.page;

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
