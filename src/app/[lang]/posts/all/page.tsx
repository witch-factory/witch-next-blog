import { PostIntroType } from '@/types/components';
import { i18n, Locale } from '@/types/i18n';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/content/helper';
import { getPostsByPage } from '@/utils/content/postMetadata';
import { generatePostListPageMetadata } from '@/utils/meta/helper';

type Props = {
  params: Promise<{
    lang: Locale,
  }>,
};

async function PostListPage({ params }: Props) {
  const currentPage = FIRST_PAGE;
  const { lang } = await params;

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

const currentPage = FIRST_PAGE;

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;

  return generatePostListPageMetadata(lang, currentPage, 'all');
}

export default PostListPage;
