import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { NextSeo, NextSeoProps } from 'next-seo';

import { CardProps } from '@/components/card';
import PageContainer from '@/components/pageContainer';
import Pagination from '@/components/pagination';
import PostList from '@/components/postList';
import { getPostsByPageAndTag } from '@/utils/post';
import { getAllPostTags } from '@/utils/postTags';
import blogConfig from 'blog-config';
import { DocumentTypes } from 'contentlayer/generated';

import { ITEMS_PER_PAGE } from './[page]';


function PostListPage({
  tag,
  tagURL,
  pagePosts,
  totalPostNumber,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO 정보 */
  const SEOInfo: NextSeoProps={
    title: `Post tag : ${tag}`,
    description: `${tag} 태그를 가진 글 목록`,
    canonical:`${blogConfig.url}${tagURL}`,
    openGraph:{
      title: `Post tag : ${tag}`,
      description: `${tag} 태그를 가진 글 목록`,
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

export const getStaticPaths: GetStaticPaths=()=>{
  const paths=getAllPostTags().map((tag)=>{
    return {
      params: { tag },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

const FIRST_PAGE=1;

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {pagePosts, totalPostNumber} = await getPostsByPageAndTag({
    tag:params?.tag as string,
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

  return {
    props: {
      tag:params?.tag,
      tagURL:`/posts/tag/${params?.tag}`,
      pagePosts:pagePostsWithThumbnail,
      totalPostNumber,
      currentPage:FIRST_PAGE,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};