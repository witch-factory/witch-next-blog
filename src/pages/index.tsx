import Head from 'next/head';

import Category from '@/components/category';
import Profile from '@/components/profile';
import ProjectList from '@/components/projectList';
import { getSortedPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import blogConfig from 'blog-config';

import styles from './styles.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>{blogConfig.title}</title>
        <meta name='description' content={blogConfig.description} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='og:image' content={blogConfig.thumbnail} />
        <meta name='twitter:image' content={blogConfig.thumbnail} />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' href='/witch-hat.svg' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='canonical' href='https://witch.work/' />
      </Head>
      <main className={styles.pagewrapper}>
        <div className={styles.container}>
          <Profile />
          {/* 프로젝트 목록을 만들기 */}
          {/* 글 목록은 독립적인 영역으로 존재 */}
          <ProjectList />
          <article>
            {blogCategoryList.map((category) => {
              const categoryPostList=getSortedPosts().filter((post)=>{
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
    </>
  );
}
