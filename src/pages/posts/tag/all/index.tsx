import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { NextSeo, NextSeoProps } from 'next-seo';

import { ITEMS_PER_PAGE } from '../[tag]/[page]';
import { CardProps } from '@/components/card';
import PageContainer from '@/components/pageContainer';
import Pagination from '@/components/pagination';
import PostList from '@/components/postList';
import Title from '@/components/title';
import { getSortedPosts } from '@/utils/post';
import blogConfig from 'blog-config';
import { DocumentTypes } from 'contentlayer/generated';


function PostListPage({
  tag,
  tagURL,
  pagePosts,
  totalPostNumber,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO 정보 */
  const SEOInfo: NextSeoProps={
    title: '전체 글',
    description: '전체 글 페이지',
    canonical:`${blogConfig.url}${tagURL}`,
    openGraph:{
      title: '전체 글',
      description: '전체 글 페이지',
      images: [
        {
          url:`${blogConfig.url}${blogConfig.thumbnail}`,
          alt: `${blogConfig.name} 프로필 사진`,
        },
      ],
      url:`${blogConfig.url}${tagURL}`,
    },
  };

  return (
    <>
      <NextSeo {...SEOInfo} />
      <PageContainer>
        <Title title={`${tag} Posts Page ${currentPage}`} />
        <Pagination
          totalItemNumber={totalPostNumber}
          currentPage={currentPage}
          renderPageLink={(page: number) => `${tagURL}/${page}`}
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
  const currentPage: number = FIRST_PAGE;
  const postsPerPage: number = ITEMS_PER_PAGE;

  const tagPosts=getSortedPosts();
  const pagenatedPosts = tagPosts.slice(
    (currentPage-1)*postsPerPage,
    currentPage*postsPerPage
  );
  const pagePosts=pagenatedPosts;
  const totalPostNumber=tagPosts.length;

  const pagePostsWithThumbnail=pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata={title, description, date, tags, url};
    return 'thumbnail' in post._raw ? 
      ({...metadata, thumbnail: post._raw.thumbnail} as CardProps) :
      metadata;
  });

  return {
    props: {
      tag:'All',
      tagURL:'/posts/tag/all',
      pagePosts:pagePostsWithThumbnail,
      totalPostNumber,
      currentPage:FIRST_PAGE,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};