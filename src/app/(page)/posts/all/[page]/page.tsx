import { Metadata } from 'next';

import { ITEMS_PER_PAGE } from '../../tag/[tag]/[page]/page';
import { CardProps } from '@/components/card';
import Pagination from '@/components/pagination';
import TagFilter from '@/components/tagFilter';
import PageContainer from '@/components/templates/pageContainer';
import PostList from '@/components/templates/postList';
import { makeTagURL } from '@/utils/makeTagURL';
import { PostType, getPostsByPage } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';

type Props={
  params: {page: number}
};

function PostListPage({ params }: Props) {
  const currentPage = params.page;
  const allTags = ['All', ...getAllPostTags()];

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
      <PageContainer>
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
      </PageContainer>
    </>
  );
}

export default PostListPage;

export function generateStaticParams() {
  const paths = [];

  const tags = getAllPostTags();

  for (const tag of tags) {
    // Prerender the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    for (let i = 0;i < 5;i++) {
      paths.push({
        tag,
        page: (i + 2).toString(),
      });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const currentPage = params.page;

  return {
    title: `전체 글 ${currentPage} 페이지`,
    description: `전체 글 ${currentPage} 페이지`,
    alternates:{
      canonical:`${blogConfig.url}/posts/all/${currentPage}`,
    },
    openGraph:{
      title: `전체 글 ${currentPage} 페이지`,
      description: `전체 글 ${currentPage} 페이지`,
      images: [
        {
          url:`${blogConfig.url}${blogConfig.thumbnail}`,
          alt: `${blogConfig.name} 프로필 사진`,
        },
      ],
      url:`${blogConfig.url}/posts/all/${currentPage}`,
    },
  };
}