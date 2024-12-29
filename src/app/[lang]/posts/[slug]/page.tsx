import {
  Metadata,
} from 'next';
import { notFound } from 'next/navigation';

import { Post } from '#site/content';
import Giscus from '@/components/giscus';
import TableOfContents from '@/components/toc';
import ViewReporter from '@/components/viewReporter';
import { blogConfig } from '@/config/blogConfig';
import { Language, locales } from '@/types/i18n';
import FrontMatter from '@/ui/frontMatter';
import { getSortedPosts } from '@/utils/post';

import * as contentStyles from './content.css';

type Props = {
  params: { lang: Language, slug: string },
};

export const revalidate = 24 * 60 * 60;

function PostPage({ params }: Props) {
  const slug = params.slug;

  const post = getSortedPosts(params.lang).find(
    (p: Post) => {
      return p.slug === slug;
    },
  );

  if (!post) {
    notFound();
  }

  return (
    <>
      <ViewReporter slug={slug} />
      <FrontMatter
        title={post.title}
        date={post.date}
        tags={post.tags}
      />
      <TableOfContents nodes={post.headingTree} />
      {/* TODO : mdx 문서 지원 */}
      <div
        className={contentStyles.content}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      {blogConfig.comment.type === 'giscus' ? <Giscus /> : null}
    </>
  );
}

export default PostPage;

export function generateStaticParams() {
  const paths = locales.flatMap((lang) => {
    return getSortedPosts(lang).map((post) => {
      return { lang, slug: post.slug };
    });
  });
  return paths;
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getSortedPosts().find(
    (p: Post) => {
      return p.slug === params.slug;
    },
  );

  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: post.url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.url,
      images: [{
        url: post.thumbnail?.[blogConfig.imageStorage] ?? blogConfig.thumbnail,
        width: 300,
        height: 200,
      }],
    },
  };
}
