import Category from '@/components/category';
import Profile from '@/components/profile';
import ProjectList from '@/components/projectList';
import { getSortedPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import { DocumentTypes } from 'contentlayer/generated';

import styles from './styles.module.css';

export default function Home() {
  return (
    <main className={styles.pagewrapper}>
      <div className={styles.container}>
        <Profile />
        {/* 프로젝트 목록을 만들기 */}
        {/* 글 목록은 독립적인 영역으로 존재 */}
        <ProjectList />
        <article>
          {blogCategoryList.map((category) => {
            const categoryPostList=getSortedPosts().filter((post: DocumentTypes)=>{
              return post._raw.flattenedPath.split('/')[0]===category.url.split('/').pop();
            }).slice(0, 3);

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
