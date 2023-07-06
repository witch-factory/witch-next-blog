import {
  GetStaticProps,
  InferGetStaticPropsType
} from 'next';

import { CardProps } from '@/components/card';
import CategoryList from '@/components/categoryList';
import {CategoryProps} from '@/components/categoryList/category';
import PageContainer from '@/components/pageContainer';
import Profile from '@/components/profile';
import ProjectList from '@/components/projectList';
import generateRssFeed from '@/utils/generateRSSFeed';
import { getSortedPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import { DocumentTypes } from 'contentlayer/generated';

function propsProperty(post: DocumentTypes) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}


export default function Home({
  categoryPostList
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <Profile />
      <ProjectList />
      <CategoryList categoryPostList={categoryPostList} />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await generateRssFeed();

  const categoryPostList: CategoryProps[]=blogCategoryList.map((category)=>{
    const {title:categoryTitle, url:categoryURL}=category;
    const postList: CardProps[]=getSortedPosts()
      .filter((post: DocumentTypes)=>{
        return post._raw.flattenedPath.split('/')[0]===category.url.split('/').pop();
      })
      .slice(0, 3)
      .map((post: DocumentTypes)=>{
        return propsProperty(post);
      });

    return {title:categoryTitle, url:categoryURL, items: postList};
  });

  return { props: { categoryPostList } };
};
