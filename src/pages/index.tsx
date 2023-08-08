import {
  GetStaticProps,
  InferGetStaticPropsType
} from 'next';

import Category, {CategoryProps} from '@/components/categoryList/category';
import PageContainer from '@/components/pageContainer';
import Profile from '@/components/profile';
import ProjectList from '@/components/projectList';
import generateRssFeed from '@/utils/generateRSSFeed';
import { getSortedPosts } from '@/utils/post';
import { DocumentTypes } from 'contentlayer/generated';

function propsProperty(post: DocumentTypes) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

export default function Home({
  categoryPosts
}: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    <PageContainer>
      <Profile />
      <ProjectList />
      <Category {...categoryPosts} />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await generateRssFeed();

  const title='최근에 작성한 글';
  const url='/posts';
  const items: CategoryProps['items']=getSortedPosts().slice(0, 9).map((post: DocumentTypes)=>{
    return propsProperty(post);
  });

  const categoryPosts: CategoryProps={
    title,
    url,
    items
  };

  return { props: { categoryPosts } };
};
