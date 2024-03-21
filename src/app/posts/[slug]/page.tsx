import {
  Metadata,
} from 'next';
import { notFound } from 'next/navigation';

import { Post } from '#site/content';
import Giscus from '@/components/molecules/giscus';
import TableOfContents from '@/components/toc';
import ViewReporter from '@/components/viewReporter';
import { formatDate, toISODate } from '@/utils/date';
import { getSortedPosts } from '@/utils/post';
import blogConfig from 'blog-config';

import contentStyles from './content.module.css';
import styles from './styles.module.css';

interface PostMatter{
  title: string;
  date: string;
  tagList: string[];
  view?: number;
}

function PostMatter(props: PostMatter) {
  const { title, date, tagList, view } = props;
  const dateObj = new Date(date);
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.infoContainer}>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj)}
        </time>
        {view && 
        <>
          <div className={styles.line}></div>
          <p className={styles.view}>조회수 {view}회</p>
        </> 
        }
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

export const revalidate = 24 * 60 * 60;

async function PostPage({ params }: Props) {
  const post = getSortedPosts().find(
    (p: Post) => {
      return p.slug === params.slug;
    }
  )!;

  const slug = params.slug;
  
  return (
    <>
      <ViewReporter slug={slug} />
      <PostMatter 
        title={post.title}
        date={post.date}
        tagList={post.tags}
      />
      <TableOfContents nodes={post.headingTree ?? []} />
      {/* TODO : mdx 문서 지원 */}
      <div
        className={contentStyles.content} 
        dangerouslySetInnerHTML={{ __html: post.html }} 
      />
      {blogConfig.comment?.type === 'giscus' ? <Giscus /> : null}
    </>
  );
}

export default PostPage;

export function generateStaticParams() {
  const paths = getSortedPosts().map((post)=>{
    return { slug:post.slug };
  });
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getSortedPosts().find(
    (p: Post) => {
      return p.slug === params.slug;
    }
  );

  if (!post) {notFound();}

  return {
    title: post.title,
    description: post.description,
    alternates:{
      canonical:`${post.url}`,
    },
    openGraph:{
      title: post.title,
      description: post.description,
      url:`${post.url}`,
      images:[{
        url:(post.thumbnail ?? {})[blogConfig.imageStorage] ?? blogConfig.thumbnail,
        width:300,
        height:200,
      }]
    }
  };
}
