import {
  GetStaticProps,
  InferGetStaticPropsType
} from 'next';

import Category from '@/components/category';
import Profile from '@/components/profile';
import ProjectList from '@/components/projectList';
import { getSortedPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import { DocumentTypes } from 'contentlayer/generated';

import styles from './styles.module.css';

interface CardProps{
  title: string;
  description: string;
  image?: string;
  date: string;
  tags: string[];
  url: string;
}

export default function Home({categoryPostMap}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className={styles.pagewrapper}>
      <div className={styles.container}>
        <Profile />
        {/* 프로젝트 목록을 만들기 */}
        {/* 글 목록은 독립적인 영역으로 존재 */}
        <ProjectList />
        <article>
          {/* 카테고리별 글 목록을 만들기 */}
          {blogCategoryList.map((category) => {
            const categoryPostList=categoryPostMap[category.url];

            return categoryPostList.length?<Category 
              key={category.title} 
              title={category.title} 
              url={category.url} 
              items={categoryPostList}
            />:null;
          })}
        </article>
      </div>
    </main>
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
        return {
          title: post.title,
          description: post.description,
          date: post.date,
          tags: post.tags,
          url: post.url
        };
      });
  });
  /*console.log(categoryPostMap);*/
  return { props: { categoryPostMap } };
};
