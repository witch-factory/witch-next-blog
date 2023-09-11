import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { NextSeo, NextSeoProps } from 'next-seo';


import Giscus from '@/components/molecules/giscus';
import PageContainer from '@/components/templates/pageContainer';
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

interface PostMatter{
  title: string;
  date: string;
  SWRfallback: {[key: string]: number};
  slug: string;
  tagList: string[];
}

function MDXComponent(props: MDXProps) {
  const MDX = useMDXComponent(props.code);
  return <MDX />;
}

function PostMatter(props: PostMatter) {
  const { title, date, slug, tagList } = props;
  const dateObj = new Date(date);
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.infoContainer}>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj)}
        </time>
        <div className={styles.line}></div>
        <ViewCounter slug={slug} />
      </div>
      <ul className={styles.tagList}>
        {tagList.map((tag: string)=>
          <li key={tag} className={styles.tag}>{tag}</li>
        )}
      </ul>
    </>
  );
}

function PostPage({
  post, fallback
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const SEOInfo: NextSeoProps = {
    title: post.title,
    description: post.description,
    canonical:`${SEOConfig.canonical}${post.url}`,
    openGraph:{
      title: post.title,
      description: post.description,
      images: [
        {
          url:`${blogConfig.url}${post._raw.thumbnail['local']}`,
          alt: `${blogConfig.name} 프로필 사진`,
        },
      ],
      url:`${SEOConfig.canonical}${post.url}`,
    }
  };

  const slug = post._raw.flattenedPath;
  
  return (
    <>
      <NextSeo {...SEOInfo} />
      <PageContainer pageType='post'>
        <PostMatter 
          title={post.title}
          date={post.date}
          SWRfallback={fallback}
          slug={slug}
          tagList={post.tags}
        />
        <TableOfContents nodes={post._raw.headingTree} />
        {'code' in post.body ?
          <div className={contentStyles.content}>
            <MDXComponent code={post.body.code}/>
          </div>
          :
          <div
            className={contentStyles.content} 
            dangerouslySetInnerHTML={{ __html: post.body.html }} 
          />
        }
        {blogConfig.comment?.type === 'giscus' ? <Giscus /> : null}
      </PageContainer>
    </>
  );
}

export default PostPage;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getSortedPosts().map((post: DocumentTypes)=>{
    return {
      params: {
        slug: post._raw.flattenedPath
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params })=>{
  const post = getSortedPosts().find(
    (p: DocumentTypes) => {
      return p._raw.flattenedPath === params?.slug;
    }
  )!;

  const URL = `/api/view?slug=${params?.slug}`;
  const fallbackData = await fetchViewCount(params?.slug);
  return {
    props: {
      post,
      fallback:{
        [URL]: fallbackData,
      }
    },
  };
};