import {
  Metadata,
} from 'next';
import { notFound } from 'next/navigation';

import { Translation } from '#site/content';
import Giscus from '@/components/giscus';
import TableOfContents from '@/components/toc';
import ViewReporter from '@/components/viewReporter';
import { blogConfig } from '@/config/blogConfig';
import FrontMatter from '@/ui/frontMatter';
import { getSortedTranslations } from '@/utils/post';

import * as contentStyles from './content.css';

type Props = {
  params: { slug: string },
};

export const revalidate = 24 * 60 * 60;

function TranslationPage({ params }: Props) {
  const slugPath = `translations/${params.slug}`;
  const post = getSortedTranslations().find(
    (p) => {
      return p.slug === slugPath;
    },
  );

  if (!post) {
    notFound();
  }

  const slug = params.slug;

  return (
    <>
      <ViewReporter slug={slug} />
      <FrontMatter
        title={post.title}
        date={post.date}
      />
      <TableOfContents nodes={post.headingTree} />
      <div
        className={contentStyles.content}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      {blogConfig.comment.type === 'giscus' ? <Giscus /> : null}
    </>
  );
}

export default TranslationPage;

export function generateStaticParams() {
  const paths = getSortedTranslations().map((post) => {
    return { slug: post.slug.split('/')[1] };
  });
  return paths;
}

export function generateMetadata({ params }: Props): Metadata {
  const slugPath = `translations/${params.slug}`;
  const post = getSortedTranslations().find(
    (p: Translation) => {
      return p.slug === slugPath;
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
