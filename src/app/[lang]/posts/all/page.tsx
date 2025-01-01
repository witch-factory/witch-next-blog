import { Metadata } from 'next';

import { PostIntroType } from '@/types/components';
import { Language, locales } from '@/types/i18n';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { generatePostsPageMetadata } from '@/utils/generatePostsPageMetadata';
import { getPostsByPage, ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/post';

function PostListPage({ params }: { params: { lang: Language } }) {
  const currentPage = FIRST_PAGE;
  const { lang } = params;

  const { pagePosts, totalPostNumber } = getPostsByPage({
    currentPage: FIRST_PAGE,
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
    </>
  );
}

const currentPage = FIRST_PAGE;

export function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }));
}

export function generateMetadata({ params }: { params: { lang: Language } }): Metadata {
  const { lang } = params;

  return generatePostsPageMetadata(lang, currentPage, 'all');
}

export default PostListPage;
