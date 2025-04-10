import { notFound, redirect } from 'next/navigation';

import { PostIntroType } from '@/types/components';
import { Locale } from '@/types/i18n';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE, allPostNumber, allEnPostNumber } from '@/utils/content/helper';
import { getPostsByPage } from '@/utils/content/postMetadata';
import { generatePostListPageMetadata } from '@/utils/meta/helper';
import { parsePage } from '@/utils/parsePage';

type Props = {
  params: Promise<{
    page: string,
    lang: Locale,
  }>,
};

async function PostListPage({ params }: Props) {
  const { page, lang } = await params;

  const currentPage = parsePage(page);

  if (currentPage === 1) {
    if (lang === 'ko') {
      return redirect('/posts/all');
    }
    return redirect(`/${lang}/posts/all`);
  }

  if (lang === 'ko' && currentPage > Math.ceil(allPostNumber / ITEMS_PER_PAGE)) {
    return notFound();
  }
  if (lang === 'en' && currentPage > Math.ceil(allEnPostNumber / ITEMS_PER_PAGE)) {
    return notFound();
  }

  const { pagePosts, totalPostNumber } = getPostsByPage({
    currentPage,
    postsPerPage: ITEMS_PER_PAGE,
  }, lang);

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, tags, url, thumbnail } = post;
    return { title, description, date, tags, url, thumbnail };
  });

  return (
    <>
      <AllPostTagFilter
        selectedTag="all"
        lang={lang}
      />
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `${lang === 'ko' ? '' : `/${lang}`}/posts/all/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
      <PostList lang={lang} postList={pagePostsWithThumbnail} />
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `${lang === 'ko' ? '' : `/${lang}`}/posts/all/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
    </>
  );
}

export default PostListPage;

export function generateStaticParams() {
  const paths = [];

  for (let i = 0; i < allPostNumber / ITEMS_PER_PAGE; i++) {
    paths.push({
      lang: 'ko',
      page: (i + 1).toString(),
    });
  }
  for (let i = 0; i < allEnPostNumber / ITEMS_PER_PAGE; i++) {
    paths.push({
      lang: 'en',
      page: (i + 1).toString(),
    });
  }
  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { page, lang } = await params;

  const currentPage = Number(page);

  return generatePostListPageMetadata(lang, currentPage, 'all');
}
