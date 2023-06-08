import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';

import Card from '@/components/card';
import PageContainer from '@/components/pageContainer';
import { getSortedPosts } from '@/utils/post';
import { DocumentTypes } from 'contentlayer/generated';

interface PostMetaData{
  title: string;
  description: string;
  date: string;
  tags: string[];
  url: string;
}

function AllPostListPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <h1>{category}</h1>
      <ul>
        {postList.map((post: PostMetaData) => 
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
