import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { NextSeo, NextSeoProps } from 'next-seo';

import { ITEMS_PER_PAGE } from '../tag/[tag]/[page]';
import { CardProps } from '@/components/card';
import PageContainer from '@/components/pageContainer';
import Pagination from '@/components/pagination';
import PostList from '@/components/postList';
import TagFilter from '@/components/tagFilter';
import { getPostsByPage } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';
import { DocumentTypes } from 'contentlayer/generated';


function PostListPage({
  allTags,
  pagePosts,
  totalPostNumber,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO 정보 */
  const SEOInfo: NextSeoProps={
    title: '전체 글 목록',
    description: '전체 글 목록',
    canonical:`${blogConfig.url}/posts/all`,
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

  return (
    <>
      <NextSeo {...SEOInfo} />
      <PageContainer>
        <TagFilter
          tags={allTags}
          selectedTag={'All'}
          makeTagURL={(tag: string) => `/posts/tag/${tag}/1`}
        />
        <Pagination
          totalItemNumber={totalPostNumber}
          currentPage={currentPage}
          renderPageLink={(page: number) => `/posts/all/${page}`}
          perPage={ITEMS_PER_PAGE}
        />
        <PostList postList={pagePosts} />
      </PageContainer>
    </>
  );
}

export default PostListPage;

const FIRST_PAGE=1;

export const getStaticProps: GetStaticProps = async () => {
  const {pagePosts, totalPostNumber} = await getPostsByPage({
    currentPage:FIRST_PAGE,
    postsPerPage:ITEMS_PER_PAGE
  });

  const pagePostsWithThumbnail=pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata={title, description, date, tags, url};
    return 'thumbnail' in post._raw ? 
      ({...metadata, thumbnail: post._raw.thumbnail} as CardProps) :
      metadata;
  });

  const allTags=['All', ...getAllPostTags()];

  return {
    props: {
      allTags,
      pagePosts:pagePostsWithThumbnail,
      totalPostNumber,
      currentPage:FIRST_PAGE,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};