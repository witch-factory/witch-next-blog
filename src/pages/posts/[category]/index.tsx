import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { NextSeo, NextSeoProps } from 'next-seo';

import CategoryPagination, { PostMetaData } from '@/components/categoryPagination';
import PageContainer from '@/components/pageContainer';
import { getSortedPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import blogConfig from 'blog-config';
import { DocumentTypes } from 'contentlayer/generated';


function PostListPage({
  category, categoryURL, postList,
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
        <CategoryPagination 
          category={category}
          currentPage={1}
          postList={postList}
        />
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

export const getStaticProps: GetStaticProps = ({params}) => {
  const allDocumentsInCategory = getSortedPosts().filter((post: DocumentTypes)=>
    post._raw.flattenedPath.startsWith(params?.category as string
    ));
  
  const {title:category, url:categoryURL}=blogCategoryList.find((c: {title: string, url: string})=>
    c.url.split('/').pop()===params?.category) as {title: string, url: string};

  const postList = allDocumentsInCategory.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata={title, description, date, tags, url};
    return 'thumbnail' in post._raw ? 
      ({...metadata, image: post._raw.thumbnail} as PostMetaData) :
      metadata;
  });

  return { props: { category, categoryURL,postList } };
};