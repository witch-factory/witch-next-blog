import { notFound } from 'next/navigation';

import { PostMetadata } from '#site/content';
import { generatePostPageMetadata } from '@/builder/metadata';
import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { i18n } from '@/constants/i18n';
import PostFrame from '@/containers/post';
import * as postStyles from '@/styles/post.css';
import { getPostBySlug, getSortedPosts } from '@/utils/content/post';
import { getSortedPostMetadatas } from '@/utils/content/postMetadata';
import { assertValidLocale } from '@/utils/core/string';

// cache revalidate in 1 day, 24 * 60 * 60 seconds
export const revalidate = 86400;

async function PostPage({ params }: PageProps<'/[lang]/posts/[slug]'>) {
  const { slug, lang } = (await params);
  assertValidLocale(lang);

  const post = getPostBySlug(slug, lang);

  // TODO: 만약 번역본 없으면 notFound 대신 한글 글로 리다이렉트하거나 번역본이 없다는 안내문
  if (!post) {
    notFound();
  }

  const localThumbnail = post.thumbnail.local;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'url': blogLocalConfig[lang].baseUrl + post.url,
    'author': {
      '@type': 'Person',
      'name': blogLocalConfig[lang].name,
      'url': blogLocalConfig[lang].baseUrl,
    },
    'datePublished': post.date,
    'dateModified': post.date,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': blogLocalConfig[lang].baseUrl + post.url,
    },
    'image': {
      '@type': 'ImageObject',
      'url': localThumbnail.startsWith('http') ? localThumbnail : blogConfig.baseUrl + localThumbnail,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostFrame lang={lang} post={post}>
        <div
          className={postStyles.content}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </PostFrame>
    </>
  );
}

export default PostPage;

export function generateStaticParams() {
  const paths = i18n.locales.flatMap((lang) => {
    return getSortedPosts(lang).map((post) => {
      return { lang, slug: post.slug };
    });
  });
  return paths;
}

export async function generateMetadata({ params }: PageProps<'/[lang]/posts/[slug]'>) {
  const { slug, lang } = (await params);
  assertValidLocale(lang);
  const post = getSortedPostMetadatas(lang).find(
    (p: PostMetadata) => {
      return p.slug === slug;
    },
  );

  if (!post) {
    notFound();
  }

  return generatePostPageMetadata(blogLocalConfig, lang, post);
}
