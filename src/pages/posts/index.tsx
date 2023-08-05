import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useCallback, ChangeEvent, useEffect, useState, useRef } from 'react';

import {CardProps} from '@/components/card';
import PageContainer from '@/components/pageContainer';
import PostList from '@/components/postList';
import SearchConsole from '@/components/searchConsole';
import Title from '@/components/title';
import filterPostsByKeyword from '@/utils/filterPosts';
import { getSortedPosts } from '@/utils/post';
import { useDebounce } from '@/utils/useDebounce';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import useSearchKeyword from '@/utils/useSearchKeyword';
import { DocumentTypes } from 'contentlayer/generated';

import { ITEMS_PER_PAGE } from './tag/[tag]/[page]';


function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, debouncedKeyword, setSearchKeyword]=useSearchKeyword();
  const [filteredPostList, setFilteredPostList]=useState<CardProps[]>(postList);
  const [page, setPage]=useState<number>(1);
  const debouncedPage = useDebounce(page.toString(), 300);

  const infiniteScrollRef=useRef<HTMLDivElement>(null);
  const totalPage=Math.ceil(filteredPostList.length/ITEMS_PER_PAGE);

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  useEffect(() => {
    setFilteredPostList(filterPostsByKeyword(postList, debouncedKeyword));
  }, [debouncedKeyword]);

  useInfiniteScroll(infiniteScrollRef, useCallback(()=>{
    if (page<totalPage) {
      setPage(prev=>prev+1);
    }
  }, [debouncedPage, totalPage]));

  return (
    <PageContainer>
      <Title title={`${category} 검색`} />
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      {filteredPostList.length===0?
        <p>검색 결과가 없습니다.</p>:null
      }
      <PostList postList={filteredPostList.slice(0, ITEMS_PER_PAGE * page)} />
      <div ref={infiniteScrollRef} />
    </PageContainer>
  );
}

export default PostSearchPage;

export const getStaticProps: GetStaticProps = async () => {
  const postList: CardProps[] = getSortedPosts().map((post: DocumentTypes) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  return { props: { category:'전체 글', postList } };
};
