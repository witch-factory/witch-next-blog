import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useState, useCallback, ChangeEvent } from 'react';

import Card from '@/components/card';
import PageContainer from '@/components/pageContainer';
import SearchConsole from '@/components/searchConsole';
import { getSortedPosts } from '@/utils/post';
import { DocumentTypes } from 'contentlayer/generated';

import styles from './styles.module.css';

interface PostMetaData{
  title: string;
  description: string;
  date: string;
  tags: string[];
  url: string;
}

function filterPostsByKeyword(posts: PostMetaData[], keyword: string) {
  if (keyword==='') return posts;
  return posts.filter((post: PostMetaData) => {
    const titleMatched = post.title.toLowerCase().includes(keyword.toLowerCase());
    const descriptionMatched = post.description.toLowerCase().includes(keyword.toLowerCase());
    /*const tagsMatched = post.tags.some((tag: string) => tag.toLowerCase().includes(keyword.toLowerCase()));*/
    return titleMatched || descriptionMatched;
  });
}

function AllPostListPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, setSearchKeyword]=useState('');

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, []);

  const filteredPostList = filterPostsByKeyword(postList, searchKeyword);

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

export default AllPostListPage;

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
