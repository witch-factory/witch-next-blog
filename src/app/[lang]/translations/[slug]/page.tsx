import { notFound } from 'next/navigation';

import { TranslationMetadata } from '#site/content';
import { generatePostPageMetadata } from '@/builder/metadata';
import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { i18n } from '@/constants/i18n';
import PostFrame from '@/containers/post';
import * as postStyles from '@/styles/post.css';
import { getSortedTranslations } from '@/utils/content/post';
import { getSortedTranslationsMetadatas } from '@/utils/content/postMetadata';
import { assertValidLocale } from '@/utils/core/string';

// cache revalidate in 1 day, 24 * 60 * 60 seconds
export const revalidate = 86400;

async function TranslationPage(props: PageProps<'/[lang]/translations/[slug]'>) {
  const { lang, slug } = (await props.params);
  assertValidLocale(lang);
  const post = getSortedTranslations().find(
    (p) => {
      return p.slug === slug;
    },
  );

  if (!post) {
    notFound();
  }

  const localThumbnail = post.thumbnail.local;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'url': blogLocalConfig[lang].url + post.url,
    'author': {
      '@type': 'Person',
      'name': blogLocalConfig[lang].name,
      'url': blogLocalConfig[lang].url,
    },
    'datePublished': post.date,
    'dateModified': post.date,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': blogLocalConfig[lang].url + post.url,
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

export default TranslationPage;

export function generateStaticParams() {
  return getSortedTranslations().flatMap((post) => {
    return i18n.locales.map((lang) => {
      return { lang, slug: post.slug };
    });
  });
}

export async function generateMetadata(props: PageProps<'/[lang]/translations/[slug]'>) {
  const { lang, slug } = (await props.params);
  assertValidLocale(lang);
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
