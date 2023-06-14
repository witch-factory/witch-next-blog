import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useCallback, ChangeEvent, useEffect, useState, useRef } from 'react';

import Card, {CardProps} from '@/components/card';
import PageContainer from '@/components/pageContainer';
import SearchConsole from '@/components/searchConsole';
import Title from '@/components/title';
import filterPostsByKeyword from '@/utils/filterPosts';
import { getSortedPosts } from '@/utils/post';
import { useDebounce } from '@/utils/useDebounce';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import useSearchKeyword from '@/utils/useSearchKeyword';
import { DocumentTypes } from 'contentlayer/generated';

import { ITEMS_PER_PAGE } from './[category]/page/[page]';
import styles from './styles.module.css';


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
      <ul className={styles.list}>
        {filteredPostList.slice(0, ITEMS_PER_PAGE * page).map((post: CardProps) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
      <div className={styles.infScroll} ref={infiniteScrollRef} />
    </PageContainer>
  );
}

export default PostSearchPage;

export const getStaticProps: GetStaticProps = () => {
  const postList: CardProps[] = getSortedPosts().map((post: DocumentTypes) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  return { props: { category:'전체 글', postList } };
};
