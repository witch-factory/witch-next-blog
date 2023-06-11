import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useCallback, ChangeEvent } from 'react';

import Card from '@/components/card';
import { PostMetaData } from '@/components/categoryPagination';
import PageContainer from '@/components/pageContainer';
import SearchConsole from '@/components/searchConsole';
import { getSortedPosts } from '@/utils/post';
import { DocumentTypes } from 'contentlayer/generated';

import filterPostsByKeyword from './filterPosts';
import styles from './styles.module.css';
import useSearchKeyword from './useSearchKeyword';


function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, debouncedKeyword, setSearchKeyword]=useSearchKeyword();

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  const filteredPostList = filterPostsByKeyword(postList, debouncedKeyword);

  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} 검색`}</h2>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      <ul className={styles.list}>
        {filteredPostList.map((post: PostMetaData) => 
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
  const postList = getSortedPosts().map((post: DocumentTypes) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  return { props: { category:'전체 글', postList } };
};
