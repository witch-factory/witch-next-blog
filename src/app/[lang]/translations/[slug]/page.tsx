import {
  Metadata,
} from 'next';
import { notFound } from 'next/navigation';

import { Translation } from '#site/content';
import Giscus from '@/components/giscus';
import TableOfContents from '@/components/toc';
import ViewReporter from '@/components/viewReporter';
import { blogConfig } from '@/config/blogConfig';
import { Language, locales } from '@/types/i18n';
import FrontMatter from '@/ui/frontMatter';
import { getSortedTranslations } from '@/utils/post';

import * as contentStyles from './content.css';

type Props = {
  params: { lang: Language, slug: string },
};

export const revalidate = 24 * 60 * 60;

function TranslationPage({ params }: Props) {
  const { lang, slug } = params;
  const post = getSortedTranslations().find(
    (p) => {
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
      />
      <TableOfContents nodes={post.headingTree} />
      <div
        className={contentStyles.content}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      {blogConfig[lang].comment.type === 'giscus' ? <Giscus lang={lang} /> : null}
    </>
  );
}

export default TranslationPage;

export function generateStaticParams() {
  const paths: Props['params'][] = getSortedTranslations().flatMap((post) => {
    return locales.map((lang) => {
      return { lang, slug: post.slug };
    });
  });

  return paths;
}

export function generateMetadata({ params }: Props): Metadata {
  const { lang, slug } = params;
  const post = getSortedTranslations().find(
    (p: Translation) => {
      return p.slug === slug;
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
        url: post.thumbnail?.[blogConfig[lang].imageStorage] ?? blogConfig[lang].thumbnail,
        width: 300,
        height: 200,
      }],
    },
  };
}
