import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useCallback, ChangeEvent, useEffect, useState } from 'react';

import Card, {CardProps} from '@/components/card';
import PageContainer from '@/components/pageContainer';
import SearchConsole from '@/components/searchConsole';
import filterPostsByKeyword from '@/utils/filterPosts';
import { getSortedPosts } from '@/utils/post';
import useSearchKeyword from '@/utils/useSearchKeyword';
import { DocumentTypes } from 'contentlayer/generated';

import styles from './styles.module.css';


function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, debouncedKeyword, setSearchKeyword]=useSearchKeyword();
  const [filteredPostList, setFilteredPostList]=useState<CardProps[]>(postList);

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  useEffect(() => {
    setFilteredPostList(filterPostsByKeyword(postList, debouncedKeyword));
  }, [debouncedKeyword]);

  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} 검색`}</h2>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      <ul className={styles.list}>
        {filteredPostList.map((post: CardProps) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
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
