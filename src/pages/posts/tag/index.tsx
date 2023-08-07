import { GetStaticProps, InferGetStaticPropsType, } from 'next';

import { CardProps } from '@/components/card';
import PageContainer from '@/components/pageContainer';
import Pagination from '@/components/pagination';
import PostList from '@/components/postList';
import TagFilter from '@/components/tagFilter';
import Title from '@/components/title';
import { getPostsByPage } from '@/utils/post';
import { getAllPostTags, makeTagURL } from '@/utils/postTags';
import { DocumentTypes } from 'contentlayer/generated';

/* 페이지당 몇 개의 글이 보이는가 */
export const ITEMS_PER_PAGE=10;

export const tagList=['All', ...getAllPostTags()];

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
        <TagFilter 
          tags={tagList} 
          selectedTag={tag} 
          makeTagURL={makeTagURL} 
        />
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

export const getStaticProps: GetStaticProps = async () => {
  const currentPage: number = 1;
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

  return {
    props: {
      tag:'All',
      tagURL:'/posts/tag/all',
      pagePosts:pagePostsWithThumbnail,
      totalPostNumber,
      currentPage:currentPage,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  };
};

export default PaginationPage;