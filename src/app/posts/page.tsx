'use client';

import { useCallback, ChangeEvent, useEffect, useState, useRef } from 'react';

import { PostIntroType } from '@/types/components';
import PostList from '@/ui/postList';
import filterPostsByKeyword from '@/utils/filterPosts';
import { getSearchPosts, ITEMS_PER_PAGE } from '@/utils/post';
import { useDebounce } from '@/utils/useDebounce';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import useSearchKeyword from '@/utils/useSearchKeyword';

import styles from './styles.module.css';

function PostSearchPage() {
  const searchPosts: PostIntroType[] = getSearchPosts();
  const [searchKeyword, debouncedKeyword, setSearchKeyword] = useSearchKeyword();
  const [filteredPostList, setFilteredPostList] = useState<PostIntroType[]>(searchPosts);
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
      <h2 className='title-md'>전체 글 검색</h2>
      <input
        className={styles.input}
        placeholder='검색어를 입력하세요'
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