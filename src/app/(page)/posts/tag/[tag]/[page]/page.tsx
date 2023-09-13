import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { CardProps } from '@/components/card';
import Pagination from '@/components/pagination';
import PostList from '@/components/postList';
import TagFilter from '@/components/tagFilter';
import { makeTagURL } from '@/utils/makeTagURL';
import { PostType, getPostsByPageAndTag } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';

type Props={
  params: {
    tag: string,
    page: number,
  }
};

/* 페이지당 몇 개의 글이 보이는가 */
export const ITEMS_PER_PAGE = 10;

export const dynamicParams = true;

function PaginationPage({ params }: Props) {
  const tag = params.tag;
  const tagURL = `/posts/tag/${tag}`;
  const currentPage = params.page;

  const { pagePosts, totalPostNumber } = getPostsByPageAndTag({
    tag,
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

  if (!pagePostsWithThumbnail.length) {
    notFound();
  }

  if (currentPage === 1) {
    redirect(`/posts/tag/${params?.tag}`);
  }

  const allTags = ['All', ...getAllPostTags()];

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

export function generateStaticParams() {
  const paths = [];

  const tags = getAllPostTags();

  for (const tag of tags) {
    // Prerender the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    for (let i = 0; i < 5;i++) {
      paths.push({
        tag,
        page: (i + 2).toString(),
      });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = params.tag;
  const currentPage = params.page;
  const tagURL = `/posts/tag/${tag}`;

  return {
    title: `Post tag : ${tag}, Page ${currentPage}`,
    description: `${tag} 태그를 가진 글 목록`,
    alternates:{
      canonical:`${blogConfig.url}${tagURL}/${currentPage}`,
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
      url:`${blogConfig.url}${tagURL}/${currentPage}`,
    },
  };
}

export default PaginationPage;