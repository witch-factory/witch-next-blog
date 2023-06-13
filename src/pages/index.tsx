import {
  GetStaticProps,
  InferGetStaticPropsType
} from 'next';

import { CardProps } from '@/components/card';
import Category from '@/components/category';
import PageContainer from '@/components/pageContainer';
import Profile from '@/components/profile';
import ProjectList from '@/components/projectList';
import { getSortedPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import { DocumentTypes } from 'contentlayer/generated';

interface CategoryPostList{
  title: string;
  url: string;
  items: CardProps[];
}

export default function Home({
  categoryPostList
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <Profile />
      {/* 프로젝트 목록을 만들기 */}
      <ProjectList />
      <article>
        {/* 카테고리별 글 목록을 만들기 */}
        {categoryPostList.map((category: CategoryPostList) => {
          return category.items.length?
            <Category
              key={category.title} 
              title={category.title} 
              url={category.url} 
              items={category.items}
            />:null;
        })
        }
      </article>
    </PageContainer>

  );
}

export const getStaticProps: GetStaticProps = () => {

  const categoryPostList: CategoryPostList[]=blogCategoryList.map((category)=>{
    const {title:categoryTitle, url:categoryURL}=category;
    const postList=getSortedPosts()
      .filter((post: DocumentTypes)=>{
        return post._raw.flattenedPath.split('/')[0]===category.url.split('/').pop();
      })
      .slice(0, 3)
      .map((post: DocumentTypes)=>{
        const {title, date, description, url, tags}=post;
        return {title, date, description, url, tags};
      });

    return {title:categoryTitle, url:categoryURL, items: postList};
  });

  return { props: { categoryPostList } };
};
