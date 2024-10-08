import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { getPostsByPage, tagPostNumber } from '@/utils/post';
import { ITEMS_PER_PAGE, getAllPostTags } from '@/utils/post';

type Props={
  params: {
    tag: string,
    page: string,
  }
};

export const dynamicParams = true;

function PaginationPage({ params }: Props) {
  const tag = params.tag;
  const tagURL = `/posts/tag/${tag}`;
  const currentPage = Number(params.page) ?? 1;

  const { pagePosts, totalPostNumber } = getPostsByPage({
    tag,
    currentPage,
    postsPerPage:ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, tags, url, thumbnail } = post;
    return { title, description, date, tags, url, thumbnail };
  });

  if (currentPage > Math.ceil(tagPostNumber(tag) / ITEMS_PER_PAGE)) {
    notFound();
  }

  if (currentPage === 1) {
    redirect(`/posts/tag/${tag}`);
  }

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

export function generateStaticParams() {
  const paths: Props['params'][] = [];
  const tags = getAllPostTags();

  for (const tag of tags) {
    // Prerender the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    for (let i = 0; i < tag.count / ITEMS_PER_PAGE + 1;i++) {
      paths.push({
        tag: tag.slug,
        page: (i + 1).toString(),
      });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = params.tag;
  const tagURL = `/posts/tag/${tag}`;
  const currentPage = params.page;

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

export default PaginationPage;