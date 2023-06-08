import {
  GetStaticProps,
  InferGetStaticPropsType
} from 'next';

import Category from '@/components/category';
import PageContainer from '@/components/pageContainer';
import Profile from '@/components/profile';
import ProjectList from '@/components/projectList';
import { getSortedPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import { DocumentTypes } from 'contentlayer/generated';

interface CardProps{
  title: string;
  description: string;
  image?: string;
  date: string;
  tags: string[];
  url: string;
}

function propsProperty(post: DocumentTypes) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

export default function Home({
  categoryPostMap
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <Profile />
      {/* 프로젝트 목록을 만들기 */}
      <ProjectList />
      <article>
        {/* 카테고리별 글 목록을 만들기 */}
        {blogCategoryList.map((category) => {
          const categoryPostList=categoryPostMap[category.url];

          return categoryPostList.length?
            <Category
              key={category.title} 
              title={category.title} 
              url={category.url} 
              items={categoryPostList}
            />:null;
        })}
      </article>
    </PageContainer>

  );
}

export const getStaticProps: GetStaticProps = () => {
  const categoryPostMap: {[key: string]: CardProps[]}={};

  blogCategoryList.forEach((category)=>{
    categoryPostMap[category.url]=getSortedPosts()
      .filter((post: DocumentTypes)=>{
        return post._raw.flattenedPath.split('/')[0]===category.url.split('/').pop();
      })
      .slice(0, 3)
      .map((post: DocumentTypes)=>{
        return propsProperty(post);
      });
  });

  return { props: { categoryPostMap } };
};
