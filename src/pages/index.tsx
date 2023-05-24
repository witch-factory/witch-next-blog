import Head from 'next/head';

import Category from '@/components/category';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Profile from '@/components/profile';
import { allDocuments } from '@/contentlayer/generated';
import blogCategoryList from 'blog-category';
import blogConfig from 'blog-config';


/*const projectList={
  title: '내 프로젝트',
  items: [
    {
      title: 'JavaScript',
      description:'자바스크립트는 최강의 언어이며 이는 고구려의 수박도에도 나와 있다',
      image:'/witch.jpeg',
      date: '2021-10-10',
      url: '/posts/javascript',
    },
    {
      title: 'Front',
      description:'프론트엔드는 최강의 포지션이며 이는 고구려의 수박도에도 나와 있다',
      image:'/witch.jpeg',
      date: '2023-05-21',
      url: '/posts/front',
    },
    {
      title: 'xo.dev',
      description:'김기동은 최강의 프론트엔드 리드이며 이는 고구려의 수박도에도 나와 있다',
      date: '2023-05-21',
      url: '/posts/kidong',
    }
  ],
};*/


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
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='canonical' href='https://witch.work/' />
      </Head>
      <main>
        <Header navList={blogCategoryList}/>
        <Profile />
        {/* 프로젝트 목록을 만들기 */}
        {/* 글 목록은 독립적인 영역으로 존재 */}
        <article>
          {blogCategoryList.map((category) => {
            const categoryPostList=allDocuments.filter((post)=>{
              return post._raw.flattenedPath.split('/')[0]===category.title.toLowerCase();
            }).slice(0, 3);
            if (categoryPostList.length===0) {
              return null;
            }
            return <Category key={category.title} title={category.title} items={categoryPostList} />;
          })
          }
        </article>
        <Footer />
      </main>
    </>
  );
}
