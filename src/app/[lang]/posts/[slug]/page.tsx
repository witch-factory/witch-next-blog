import {
  Metadata,
} from 'next';
import { notFound } from 'next/navigation';

import { Post, PostMetadata } from '#site/content';
import Giscus from '@/components/giscus';
import TableOfContents from '@/components/toc';
import TranslationNotice from '@/components/translationNotice';
import ViewReporter from '@/components/viewReporter';
import { blogConfig } from '@/config/blogConfig';
import { Language, locales } from '@/types/i18n';
import FrontMatter from '@/ui/frontMatter';
import { getSortedPostMetadatas, getSortedPosts } from '@/utils/post';

import * as contentStyles from './content.css';

type Props = {
  params: { lang: Language, slug: string },
};

export const revalidate = 24 * 60 * 60;

function PostPage({ params }: Props) {
  const slug = params.slug;
  const lang = params.lang;

  const post = getSortedPosts(lang).find(
    (p: Post) => {
      return p.slug === slug;
    },
  );

  // TODO: 만약 번역본 없으면 notFound 대신 한글 글로 리다이렉트하거나
  // 번역본이 없다는 안내문을 띄울 것
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
      <TableOfContents lang={lang} nodes={post.headingTree} />
      {/* TODO : mdx 문서 지원 */}
      <TranslationNotice lang={params.lang} />
      <div
        className={contentStyles.content}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      {blogConfig[lang].comment.type === 'giscus' ? <Giscus lang={lang} /> : null}
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
  const { slug, lang } = params;
  const post = getSortedPostMetadatas(lang).find(
    (p: PostMetadata) => {
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
        alt: `${post.title} thumbnail`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@witch_front',
      creator: '@witch_front',
      title: post.title,
      description: post.description,
      images: [
        {
          url: post.thumbnail?.[blogConfig[lang].imageStorage] ?? blogConfig[lang].thumbnail,
          alt: `${post.title} thumbnail`,
        },
      ],
    },
  };
}
