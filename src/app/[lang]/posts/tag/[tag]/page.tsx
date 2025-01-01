import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostIntroType } from '@/types/components';
import { Language, locales } from '@/types/i18n';
import AllPostTagFilter from '@/ui/allPostTagFilter';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { generatePostsPageMetadata } from '@/utils/generatePostsPageMetadata';
import { getPostsByPage, ITEMS_PER_PAGE, FIRST_PAGE } from '@/utils/post';
import { getAllPostTags } from '@/utils/post';

type Props = {
  params: {
    lang: Language,
    tag: string,
  },
};

function PostListPage({ params }: Props) {
  const { tag, lang } = params;
  const allTags = getAllPostTags(lang);
  const currentTag = allTags.find((tagElem) => tagElem.slug === tag);
  const currentPage = FIRST_PAGE;

  if (currentTag === undefined) {
    notFound();
  }

  const { pagePosts, totalPostNumber } = getPostsByPage({
    tag: params.tag,
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

export default PostListPage;

export const generateStaticParams = () => {
  const paths = getAllPostTags().flatMap((tag) => {
    return locales.map((lang) => {
      return { params: { lang, tag: tag.slug } };
    });
  });
  return paths;
};

const currentPage = FIRST_PAGE;

export function generateMetadata({ params }: Props): Metadata {
  const { tag, lang } = params;

  return generatePostsPageMetadata(lang, currentPage, tag);
}
