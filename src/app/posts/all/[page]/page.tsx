import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { CardProps } from '@/components/organisms/card';
import Pagination from '@/components/organisms/pagination';
import PostList from '@/components/templates/postList';
import ArticleTagFilter from '@/ui/postTagFilter';
import { makeTagURL } from '@/utils/makeTagURL';
import { ITEMS_PER_PAGE, allPostNumber } from '@/utils/post';
import { PostType, getPostsByPage } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';


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

  const pagePostsWithThumbnail = pagePosts.map((post: PostType) => {
    const { title, description, date, tags, url } = post;
    const metadata = { title, description, date, tags, url };
    return 'thumbnail' in post._raw ? 
      ({ ...metadata, image: post._raw.thumbnail } as CardProps) :
      metadata;
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
