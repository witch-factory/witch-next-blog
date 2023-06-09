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
import Title from '@/components/title';
import { getCategoryPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import blogConfig from 'blog-config';
import { DocumentTypes } from 'contentlayer/generated';

import { ITEMS_PER_PAGE } from './page/[page]';


function PostListPage({
  category,
  categoryURL,
  pagePosts,
  totalPostNumber,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO 정보 */
  const SEOInfo: NextSeoProps={
    title: `${category} 주제의 글`,
    description: `${category} 주제의 글들을 모아서 보여주는 페이지`,
    canonical:`${blogConfig.url}${categoryURL}`,
    openGraph:{
      title: `${category} 주제의 글`,
      description: `${category} 주제의 글들을 모아서 보여주는 페이지`,
      images: [
        {
          url:`${blogConfig.url}${blogConfig.thumbnail}`,
          alt: `${blogConfig.name} 프로필 사진`,
        },
      ],
      url:`${blogConfig.url}${categoryURL}`,
    },
  };

  return (
    <>
      <NextSeo {...SEOInfo} />
      <PageContainer>
        <Title title={`${category} 주제 ${currentPage} 페이지`} />
        <Pagination
          totalItemNumber={totalPostNumber}
          currentPage={currentPage}
          renderPageLink={(page: number) => `${categoryURL}/page/${page}`}
          perPage={ITEMS_PER_PAGE}
        />
        <PostList postList={pagePosts} />
      </PageContainer>
    </>
  );
}

export default PostListPage;

export const getStaticPaths: GetStaticPaths=()=>{
  const paths=blogCategoryList.map((category)=>{
    return {
      params: {
        category:category.url.split('/').pop(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

const FIRST_PAGE=1;

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {pagePosts, totalPostNumber} = await getCategoryPosts({
    category:params?.category as string,
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

  const {title:category, url:categoryURL}=blogCategoryList.find((c: {title: string, url: string})=>
    c.url.split('/').pop()===params?.category) as {title: string, url: string};

  return {
    props: {
      category,
      categoryURL,
      pagePosts:pagePostsWithThumbnail,
      totalPostNumber,
      currentPage:FIRST_PAGE,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};