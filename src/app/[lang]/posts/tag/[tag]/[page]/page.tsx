import { notFound, redirect } from 'next/navigation';

import * as styles from '@/app/[lang]/styles.css';
import { i18n, Locale } from '@/constants/i18n';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import PostCard from '@/modules/postCard';
import { PostIntroType } from '@/types/components';
import Pagination from '@/ui/pagination';
import { getPostsByPage } from '@/utils/content/postMetadata';
import { getPostCountByTag, getAllPostTags } from '@/utils/content/tag';
import { parseNumber } from '@/utils/core/string';
import { generatePostListPageMetadata } from '@/utils/meta/helper';

type Props = {
  params: Promise<{
    tag: string,
    page: string,
    lang: Locale,
  }>,
};

export const dynamicParams = true;

async function TagPaginationPage({ params }: Props) {
  const { tag, lang, page } = await params;
  const allTags = getAllPostTags(lang);
  const currentTag = allTags.find((tagElem) => tagElem.slug === tag);
  const currentPage = parseNumber(page, 1);

  if (currentTag === undefined) {
    notFound();
  }

  if (currentPage === 1) {
    redirect(currentTag.url);
  }

  const postNumber = getPostCountByTag(lang, tag);

  if (!postNumber || currentPage > Math.ceil(postNumber / ITEMS_PER_PAGE)) {
    notFound();
  }

  const { pagePosts, totalPostNumber } = getPostsByPage({
    tag: (tag === 'all' ? undefined : tag),
    currentPage,
    postsPerPage: ITEMS_PER_PAGE,
  }, lang);

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, tags, url, thumbnail } = post;
    return { title, description, date, tags, url, thumbnail };
  });

  return (
    <>
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `${currentTag.url}/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
      <ul className={styles.postList}>
        {pagePostsWithThumbnail.map((post) => (
          <li key={post.url}>
            <PostCard lang={lang} {...post} />
          </li>
        ))}
      </ul>
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `${currentTag.url}/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
    </>
  );
}

export function generateStaticParams() {
  const paths: Awaited<Props['params']>[] = [];
  for (const lang of i18n.locales) {
    const tags = getAllPostTags(lang);
    for (const tag of tags) {
      for (let i = 0; i < tag.count / ITEMS_PER_PAGE + 1; i++) {
        paths.push({
          tag: tag.slug,
          page: (i + 1).toString(),
          lang,
        });
      }
    }
  }

  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { lang, tag, page } = await params;
  const currentPage = parseNumber(page, 1);

  return generatePostListPageMetadata(lang, currentPage, tag);
}

export default TagPaginationPage;
