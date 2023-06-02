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
  image?: string;
  headings?: string[];
  date: string;
  tags: string[];
  url: string;
}

function generateQueryString(title: string, headings: string[]) {
  const queryString=new URLSearchParams();
  queryString.append('title', title);
  queryString.append('headings', JSON.stringify(headings));
  return queryString.toString();
}

function PostListPage({
  category, categoryURL, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /* SEO 정보 */
  const SEOInfo: NextSeoProps={
    title: `${category} 주제의 글`,
    description: `${category} 주제의 글들을 모아서 보여주는 페이지`,
    canonical:`${blogConfig.url}${categoryURL}`,
    openGraph:{
      title: `${category} 주제의 글`,
      description: `${category} 주제의 글들을 모아서 보여주는 페이지`,
      images: [
        {
          url:`${blogConfig.url}${blogConfig.thumbnail}`,
          alt: `${blogConfig.name} 프로필 사진`,
        },
      ],
      url:`${blogConfig.url}${categoryURL}`,
    },
  };

  return (
    <main className={styles.page}>
      <NextSeo {...SEOInfo} />
      <div className={styles.container}>
        <h1 className={styles.title}>{`${category} 주제의 글`}</h1>
        <ul className={styles.list}>
          {postList.map((post: PostMetaData) =>{
            if (!('image' in post)) {
              post.image=`localhost:3000/api/thumbnail?${generateQueryString(post.title, post.headings as string[])}`;
            }
            return (
              <li key={post.url}>
                <Card {...post} />
              </li>
            );
          }

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
  
  const {title:category, url:categoryURL}=blogCategoryList.find((c)=>
    c.url.split('/').pop()===params?.category) as {title: string, url: string};

  const postList = allDocumentsInCategory.map((post) => {
    const { title, description, date, tags, url } = post;
    const metadata={title, description, date, tags, url};
    return 'thumbnail' in post._raw ? 
      ({...metadata, image: post._raw.thumbnail} as PostMetaData) 
      : ({...metadata});
  });

  return { props: { category, categoryURL,postList } };
};