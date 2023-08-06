import { GetStaticPaths, GetStaticProps, GetStaticPropsContext,   InferGetStaticPropsType, } from 'next';

import { CardProps } from '@/components/card';
import PageContainer from '@/components/pageContainer';
import Pagination from '@/components/pagination';
import PostList from '@/components/postList';
import Title from '@/components/title';
import { getPostsByPage } from '@/utils/post';
import { DocumentTypes } from 'contentlayer/generated';

/* 페이지당 몇 개의 글이 보이는가 */
export const ITEMS_PER_PAGE=10;

function PaginationPage({
  tag, 
  tagURL,
  pagePosts, 
  totalPostNumber,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageContainer>
        <Title title={`${tag} Tag Page ${currentPage}`} />
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

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const page: number = Number(params?.page) || 1;

  const currentPage: number = page;
  const postsPerPage: number = ITEMS_PER_PAGE;

  const {pagePosts, totalPostNumber}=await getPostsByPage({
    currentPage,
    postsPerPage,
  });

  const pagePostsWithThumbnail=pagePosts.map((post: DocumentTypes) => {
    const { title, description, date, tags, url } = post;
    const metadata={title, description, date, tags, url};
    return 'thumbnail' in post._raw ? 
      ({...metadata, thumbnail: post._raw.thumbnail} as CardProps) :
      metadata;
  });

  if (!pagePostsWithThumbnail.length) {
    return {
      notFound: true,
    };
  }
  
  if (page===1) {
    return {
      redirect: {
        destination: '/posts/tag/all',
        permanent: false,
      },
    };
  }

  return {
    props: {
      tag:'All',
      tagURL:'/posts/tag/all',
      pagePosts:pagePostsWithThumbnail,
      totalPostNumber,
      currentPage:page,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};

export default PaginationPage;