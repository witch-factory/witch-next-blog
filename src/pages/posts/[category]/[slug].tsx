import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useMDXComponent } from 'next-contentlayer/hooks';

import { getSortedPosts } from '@/utils/post';

import styles from './styles.module.css';


interface MDXProps{
  code: string;
}

function MDXComponent(props: MDXProps) {
  const MDX = useMDXComponent(props.code);
  return <MDX />;
}

function PostPage({
  post
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className={styles.articlewrapper}>
      <article>
        <h1>{post.title}</h1>
        <time>{post.date}</time>
        <ul>
          {post.tags.map((tag: string)=><li key={tag}>{tag}</li>)}
        </ul>
        {'code' in post.body?
          <MDXComponent code={post.body.code}/>:
          <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
        }
      </article>
    </main>
  );
}

export default PostPage;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getSortedPosts().map(({_raw})=>{
    const pathList=_raw.flattenedPath.split('/');
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

export const getStaticProps: GetStaticProps= ({params})=>{
  const post = getSortedPosts().find(
    (p) => {
      const temp=p._raw.flattenedPath.split('/');
      return temp[0] === params?.category && temp[1] === params?.slug;
    }
  )!;
  return {
    props: {
      post,
    },
  };
};