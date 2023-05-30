import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';

import Card from '@/components/card';
import { getSortedPosts } from '@/utils/post';
import blogCategoryList from 'blog-category';

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
  return (
    <main className={styles.page}>
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