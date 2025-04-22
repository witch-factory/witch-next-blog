import { notFound } from 'next/navigation';

import { PostIntroType } from '@/types/components';
import { i18n, Locale } from '@/types/i18n';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/content/helper';
import { getPostsByPage } from '@/utils/content/postMetadata';
import { getAllPostTags } from '@/utils/content/tag';
import { generatePostListPageMetadata } from '@/utils/meta/helper';

type Props = {
  params: Promise<{
    lang: Locale,
    tag: string,
  }>,
};

async function PostListPage({ params }: Props) {
  const { tag, lang } = await params;
  const allTags = getAllPostTags(lang);
  const currentTag = allTags.find((tagElem) => tagElem.slug === tag);
  const currentPage = FIRST_PAGE;

  if (currentTag === undefined) {
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
      <PostList lang={lang} posts={pagePostsWithThumbnail} />
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `${currentTag.url}/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
    </>
  );
}

export default PostListPage;

export const generateStaticParams = () => {
  const paths = i18n.locales.flatMap((lang) => {
    return getAllPostTags(lang).map((tag) => {
      return { lang, tag: tag.slug };
    });
  });
  return paths;
};

const currentPage = FIRST_PAGE;

export async function generateMetadata({ params }: Props) {
  const { tag, lang } = await params;

  return generatePostListPageMetadata(lang, currentPage, tag);
}
