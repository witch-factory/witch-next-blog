import { notFound } from 'next/navigation';

import { TranslationMetadata } from '#site/content';
import Giscus from '@/components/giscus';
import TableOfContents from '@/components/toc';
import ViewReporter from '@/components/viewReporter';
import { blogLocalConfig } from '@/config/blogConfig';
import { i18n, Locale } from '@/types/i18n';
import FrontMatter from '@/ui/frontMatter';
import { getSortedTranslations } from '@/utils/content/post';
import { getSortedTranslationsMetadatas } from '@/utils/content/postMetadata';
import { generatePostPageMetadata } from '@/utils/meta/helper';

import * as contentStyles from './content.css';

type Props = {
  params: Promise<{ lang: Locale, slug: string }>,
};

// cache revalidate in 1 day, 24 * 60 * 60 seconds
export const revalidate = 86400;

async function TranslationPage({ params }: Props) {
  const { lang, slug } = await params;
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
        lang={lang}
        title={post.title}
        date={post.date}
      />
      <TableOfContents lang={lang} nodes={post.headingTree} />
      <div
        className={contentStyles.content}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      {blogLocalConfig[lang].comment.type === 'giscus' ? <Giscus lang={lang} /> : null}
    </>
  );
}

export default TranslationPage;

export function generateStaticParams() {
  const paths: Awaited<Props['params']>[] = getSortedTranslations().flatMap((post) => {
    return i18n.locales.map((lang) => {
      return { lang, slug: post.slug };
    });
  });

  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const post = getSortedTranslationsMetadatas().find(
    (p: TranslationMetadata) => {
      return p.slug === slug;
    },
  );

  if (!post) {
    notFound();
  }

  return generatePostPageMetadata(blogLocalConfig, lang, post);
}
