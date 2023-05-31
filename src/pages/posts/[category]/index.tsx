import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { NextSeo, NextSeoProps } from 'next-seo';

import Card from '@/components/card';
import { getSortedPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';
import blogConfig from 'blog-config';

import styles from './styles.module.css';



interface PostMetaData{
  title: string;
  description: string;
  date: string;
  tags: string[];
  url: string;
}

function PostListPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const SEOInfo: NextSeoProps={
    title: `${category} 주제의 글`,
    description: `${category} 주제의 글들을 모아서 보여주는 페이지`,
    openGraph:{
      title: `${category} 주제의 글`,
      description: `${category} 주제의 글들을 모아서 보여주는 페이지`,
      images: [
        {
          url:'/witch.jpeg',
          alt: `${blogConfig.name} 프로필 사진`,
        },
      ],
    },
  };

  return (
    <main className={styles.page}>
      <NextSeo {...SEOInfo} />
      <div className={styles.container}>
        <h1 className={styles.title}>{`${category} 주제의 글`}</h1>
        <ul className={styles.list}>
          {postList.map((post: PostMetaData) => 
            <li key={post.url}>
              <Card {...post} />
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}

export default PostListPage;

export const getStaticPaths: GetStaticPaths=()=>{
  const paths=blogCategoryList.map((category)=>{
    return {
      params: {
        category:category.url.split('/').pop(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = ({params}) => {
  const allDocumentsInCategory = getSortedPosts().filter((post)=>
    post._raw.flattenedPath.startsWith(params?.category as string
    ));

  const category=blogCategoryList.find((c)=>
    c.url.split('/').pop()===params?.category)?.title;

  const postList = allDocumentsInCategory.map((post) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
  return { props: { category, postList } };
};