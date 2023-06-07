import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { NextSeo, NextSeoProps } from 'next-seo';
import { SWRConfig } from 'swr';

import TableOfContents from '@/components/toc';
import ViewCounter from '@/components/viewCounter';
import { fetchViewCount } from '@/lib/supabaseClient';
import { formatDate, toISODate } from '@/utils/date';
import { getSortedPosts } from '@/utils/post';
import { SEOConfig } from 'blog-config';
import blogConfig from 'blog-config';
import { DocumentTypes } from 'contentlayer/generated';

import contentStyles from './content.module.css';
import styles from './styles.module.css';

interface MDXProps{
  code: string;
}

function MDXComponent(props: MDXProps) {
  const MDX = useMDXComponent(props.code);
  return <MDX />;
}

function PostPage({
  post, fallback
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const dateObj=new Date(post.date);

  const SEOInfo: NextSeoProps={
    title: post.title,
    description: post.description,
    canonical:`${SEOConfig.canonical}${post.url}`,
    openGraph:{
      title: post.title,
      description: post.description,
      images: [
        {
          url:`${blogConfig.url}${post._raw.thumbnail}`,
          alt: `${blogConfig.name} 프로필 사진`,
        },
      ],
      url:`${SEOConfig.canonical}${post.url}`,
    }
  };

  const slug=post._raw.flattenedPath.split('/')[1];

  return (
    <main className={styles.page}>
      <NextSeo {...SEOInfo} />
      <article className={styles.container}>
        <h1 className={styles.title}>{post.title}</h1>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj)}
        </time>
        <ul className={styles.tagList}>
          {post.tags.map((tag: string)=>
            <li key={tag} className={styles.tag}>{tag}</li>
          )}
        </ul>
        <SWRConfig value={{fallback}}>
          <ViewCounter slug={slug} />
        </SWRConfig>
        
        <TableOfContents nodes={post._raw.headingTree} />
        {'code' in post.body?
          <div className={contentStyles.content}>
            <MDXComponent code={post.body.code}/>
          </div>
          :
          <div
            className={contentStyles.content} 
            dangerouslySetInnerHTML={{ __html: post.body.html }} 
          />
        }
      </article>
    </main>
  );
}

export default PostPage;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getSortedPosts().map((post: DocumentTypes)=>{
    const pathList=post._raw.flattenedPath.split('/');
    return {
      params: {
        category: pathList[0],
        slug: pathList[1],
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps= async ({params})=>{
  const post = getSortedPosts().find(
    (p: DocumentTypes) => {
      const temp=p._raw.flattenedPath.split('/');
      return temp[0] === params?.category && temp[1] === params?.slug;
    }
  )!;

  const URL=`/api/view?slug=${params?.slug}`;
  const fallbackData=await fetchViewCount(params?.slug);
  return {
    props: {
      post,
      fallback:{
        [URL]: fallbackData,
      }
    },
  };
};