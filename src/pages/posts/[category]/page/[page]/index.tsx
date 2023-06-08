import { GetStaticPaths, GetStaticProps, GetStaticPropsContext,   InferGetStaticPropsType, } from 'next';
import { useEffect } from 'react';

import CategoryPagination, { PostMetaData } from '@/components/categoryPagination';
import PageContainer from '@/components/pageContainer';
import { getCategoryPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import { DocumentTypes } from 'contentlayer/generated';


/* 페이지당 몇 개의 글이 보이는가 */
export const ITEM_PER_PAGE=10;

function PaginationPage({
  category, 
  pagePosts, 
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  useEffect(()=>{
    console.log(pagePosts);
  }, []);
  return (
    <>
      <PageContainer>
        <CategoryPagination 
          category={category}
          currentPage={currentPage}
          postList={pagePosts}
        />
      </PageContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths=[];
  for (const category of blogCategoryList) {
    const categoryURL=category.url.split('/').pop();
    // Prerender the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    for (let i=1;i<=5;i++) {
      paths.push(`/posts/${categoryURL}/page/${i}`);
    }
  }
  return {
    paths,
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const page: number = Number(params?.page) || 1;
  const {pagePosts, totalPostNumber} = await getCategoryPosts({
    category:params?.category as string, 
    currentPage:page, 
    postsPerPage:ITEM_PER_PAGE
  });

  const pagePostsWithThumbnail=pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata={title, description, date, tags, url};
    return 'thumbnail' in post._raw ? 
      ({...metadata, image: post._raw.thumbnail} as PostMetaData) :
      metadata;
  });

  const {title:category, url:categoryURL}=blogCategoryList.find((c: {title: string, url: string})=>
    c.url.split('/').pop()===params?.category) as {title: string, url: string};

  if (page===1) {
    return {
      redirect: {
        destination: `/posts/${params?.category}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      category,
      categoryURL,
      pagePosts:pagePostsWithThumbnail,
      totalPostNumber,
      currentPage:page,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};

export default PaginationPage;