import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { PostIntroType } from '@/types/components';
import { Language } from '@/types/i18n';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE, allPostNumber, allEnPostNumber } from '@/utils/content/helper';
import { getPostsByPage } from '@/utils/content/postMetadata';
import { generatePostsPageMetadata } from '@/utils/generatePostsPageMetadata';
import { parsePage } from '@/utils/parsePage';

type Props = {
  params: {
    page: string,
    lang: Language,
  },
};

function PostListPage({ params }: Props) {
  const { lang } = params;
  const currentPage = parsePage(params.page);

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
      <PostList postList={pagePostsWithThumbnail} />
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

export function generateMetadata({ params }: Props): Metadata {
  const currentPage = Number(params.page);
  const { lang } = params;

  return generatePostsPageMetadata(lang, currentPage, 'all');
}
