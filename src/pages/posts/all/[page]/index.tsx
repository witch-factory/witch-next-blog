import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { NextSeo, NextSeoProps } from 'next-seo';

import { ITEMS_PER_PAGE } from '../../tag/[tag]/[page]';
import { CardProps } from '@/components/card';
import PageContainer from '@/components/pageContainer';
import Pagination from '@/components/pagination';
import PostList from '@/components/postList';
import TagFilter from '@/components/tagFilter';
import { makeTagURL } from '@/utils/makeTagURL';
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
    title: `전체 글 ${currentPage} 페이지`,
    description: `전체 글 ${currentPage} 페이지`,
    canonical:`${blogConfig.url}/posts/all/${currentPage}`,
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

  return (
    <>
      <NextSeo {...SEOInfo} />
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
        <PostList postList={pagePosts} />
      </PageContainer>
    </>
  );
}

export default PostListPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths=[];

  for (let i=0;i<5;i++) {
    paths.push({
      params: {
        page: (i+2).toString(),
      }
    });
  }

  return {
    paths,
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  };
};


export const getStaticProps: GetStaticProps = async ({params}) => {
  const page: number = Number(params?.page) || 1;

  const {pagePosts, totalPostNumber} = await getPostsByPage({
    currentPage:page,
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
      currentPage:page,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};