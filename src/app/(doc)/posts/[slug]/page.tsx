import {
  Metadata,
} from 'next';
import { useMDXComponent } from 'next-contentlayer/hooks';

import Giscus from '@/components/molecules/giscus';
import TableOfContents from '@/components/toc';
import { formatDate, toISODate } from '@/utils/date';
import { PostType, getSortedPosts } from '@/utils/post';
import { SEOConfig } from 'blog-config';
import blogConfig from 'blog-config';

import contentStyles from './content.module.css';
import styles from './styles.module.css';

interface MDXProps{
  code: string;
}

interface PostMatter{
  title: string;
  date: string;
  slug: string;
  tagList: string[];
}

function MDXComponent(props: MDXProps) {
  const MDX = useMDXComponent(props.code);
  return <MDX />;
}

function PostMatter(props: PostMatter) {
  const { title, date, tagList } = props;
  const dateObj = new Date(date);
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.infoContainer}>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj)}
        </time>
        {/*<div className={styles.line}></div>
        <ViewCounter slug={slug} />*/}
      </div>
      <ul className={styles.tagList}>
        {tagList.map((tag: string)=>
          <li key={tag} className={styles.tag}>{tag}</li>
        )}
      </ul>
    </>
  );
}

type Props={
  params: {slug: string}
};

function PostPage({ params }: Props) {
  const post = getSortedPosts().find(
    (p: PostType) => {
      return p._raw.flattenedPath === params.slug;
    }
  )!;

  const slug = post._raw.flattenedPath;
  
  return (
    <>
      <PostMatter 
        title={post.title}
        date={post.date}
        slug={slug}
        tagList={post.tags}
      />
      <TableOfContents nodes={post._raw.headingTree ?? []} />
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
    </>
  );
}

export default PostPage;

export function generateStaticParams() {
  const paths = getSortedPosts().map((post: PostType)=>{
    return { slug:post._raw.flattenedPath };
  });
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getSortedPosts().find(
    (p: PostType) => {
      return p._raw.flattenedPath === params.slug;
    }
  )!;

  return {
    title: post.title,
    description: post.description,
    alternates:{
      canonical:`${SEOConfig.canonical}${post.url}`,
    },
    openGraph:{
      title: post.title,
      description: post.description,
      images: [
        {
          url:`${blogConfig.url}${post._raw.thumbnail?.local ?? ''}`,
          alt: `${blogConfig.name} 프로필 사진`,
        },
      ],
      url:`${SEOConfig.canonical}${post.url}`,
    }
  };
}
