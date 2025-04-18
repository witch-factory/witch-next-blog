import { notFound } from 'next/navigation';

import { PostMetadata } from '#site/content';
import TableOfContents from '@/components/toc';
import TranslationNotice from '@/components/translationNotice';
import { blogLocalConfig } from '@/config/blogConfig';
import Giscus from '@/features/giscus';
import ViewReporter from '@/features/viewReporter';
import * as postStyles from '@/styles/post.css';
import { i18n, Locale } from '@/types/i18n';
import FrontMatter from '@/ui/frontMatter';
import { getPostBySlug, getSortedPosts } from '@/utils/content/post';
import { getSortedPostMetadatas } from '@/utils/content/postMetadata';
import { generatePostPageMetadata } from '@/utils/meta/helper';

type Props = {
  params: Promise<{ lang: Locale, slug: string }>,
};

// cache revalidate in 1 day, 24 * 60 * 60 seconds
export const revalidate = 86400;

async function PostPage({ params }: Props) {
  const { slug, lang } = await params;

  const post = getPostBySlug(slug, lang);

  // const post = getSortedPosts(lang).find(
  //   (p: Post) => {
  //     return p.slug === slug;
  //   },
  // );

  // TODO: 만약 번역본 없으면 notFound 대신 한글 글로 리다이렉트하거나
  // 번역본이 없다는 안내문을 띄울 것
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
        tags={post.tags}
      />
      <TableOfContents lang={lang} nodes={post.headingTree} />
      {/* TODO : mdx 문서 지원 */}
      <TranslationNotice lang={lang} />
      <div
        className={postStyles.content}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      {blogLocalConfig[lang].comment.type === 'giscus' ? <Giscus lang={lang} /> : null}
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

export async function generateMetadata({ params }: Props) {
  const { slug, lang } = await params;
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
