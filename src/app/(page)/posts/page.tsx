'use client';

import { useCallback, ChangeEvent, useEffect, useState, useRef } from 'react';

import { ITEMS_PER_PAGE } from '../posts/tag/[tag]/[page]/page';
import Title from '@/components/atoms/title';
import { CardProps } from '@/components/card';
import SearchConsole from '@/components/molecules/searchConsole';
import PostList from '@/components/templates/postList';
import filterPostsByKeyword from '@/utils/filterPosts';
import { getSearchPosts } from '@/utils/post';
import { useDebounce } from '@/utils/useDebounce';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import useSearchKeyword from '@/utils/useSearchKeyword';


function PostSearchPage() {
  const searchPosts: CardProps[] = getSearchPosts();
  const [searchKeyword, debouncedKeyword, setSearchKeyword] = useSearchKeyword();
  const [filteredPostList, setFilteredPostList] = useState<CardProps[]>(searchPosts);
  const [page, setPage] = useState<number>(1);
  const debouncedPage = useDebounce(page.toString(), 300);

  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const totalPage = Math.ceil(filteredPostList.length / ITEMS_PER_PAGE);

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  useEffect(() => {
    setFilteredPostList(filterPostsByKeyword(searchPosts, debouncedKeyword));
  }, [debouncedKeyword]);

  useInfiniteScroll(infiniteScrollRef, useCallback(()=>{
    if (page < totalPage) {
      setPage(prev=>prev + 1);
    }
  }, [debouncedPage, totalPage]));

  return (
    <>
      <Title heading='h2' size='md'>전체 글 검색</Title>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      {filteredPostList.length === 0 ?
        <p>검색 결과가 없습니다.</p> : null
      }
      <PostList postList={filteredPostList.slice(0, ITEMS_PER_PAGE * page)} />
      <div ref={infiniteScrollRef} />
    </>
  );
}

export default PostSearchPage;