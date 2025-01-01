import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { PostIntroType } from '@/types/components';
import { Language, locales } from '@/types/i18n';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { generatePostsPageMetadata } from '@/utils/generatePostsPageMetadata';
import { parsePage } from '@/utils/parsePage';
import { getPostsByPage, tagPostNumber } from '@/utils/post';
import { ITEMS_PER_PAGE, getAllPostTags } from '@/utils/post';

type Props = {
  params: {
    tag: string,
    page: string,
    lang: Language,
  },
};

export const dynamicParams = true;

function TagPaginationPage({ params }: Props) {
  const { tag, lang } = params;
  const allTags = getAllPostTags(lang);
  const currentTag = allTags.find((tagElem) => tagElem.slug === tag);
  const currentPage = parsePage(params.page);

  if (currentTag === undefined) {
    notFound();
  }

  const { pagePosts, totalPostNumber } = getPostsByPage({
    tag,
    currentPage,
    postsPerPage: ITEMS_PER_PAGE,
  }, lang);

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, tags, url, thumbnail } = post;
    return { title, description, date, tags, url, thumbnail };
  });

  const postNumber = tagPostNumber(lang, tag);

  if (!postNumber) {
    notFound();
  }

  if (currentPage > Math.ceil(postNumber / ITEMS_PER_PAGE)) {
    notFound();
  }

  if (currentPage === 1) {
    redirect(currentTag.url);
  }

  return (
    <>
      <AllPostTagFilter
        selectedTag={tag}
        lang={lang}
      />
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `${currentTag.url}/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
      <PostList postList={pagePostsWithThumbnail} />
    </>
  );
}

export function generateStaticParams() {
  const paths: Props['params'][] = [];
  const tags = getAllPostTags();

  for (const tag of tags) {
    // Prerender the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    for (let i = 0; i < tag.count / ITEMS_PER_PAGE + 1; i++) {
      for (const lang of locales) {
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

export function generateMetadata({ params }: Props): Metadata {
  const { lang, tag, page } = params;
  const currentPage = parsePage(page);

  return generatePostsPageMetadata(lang, currentPage, tag);
}

export default TagPaginationPage;
