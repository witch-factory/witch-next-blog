import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import * as styles from '@/app/[lang]/styles.css';
import { blogLocalConfig } from '@/config/blogConfig';
import { i18n, Locale } from '@/constants/i18n';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import { allTranslationNumber } from '@/constants/stats';
import PostCard from '@/modules/postCard';
import { PostIntroType } from '@/types/components';
import Pagination from '@/ui/pagination';
import { getTranslationsByPage } from '@/utils/content/postMetadata';
import { parseNumber } from '@/utils/core/parseNumber';

type Props = {
  params: Promise<{
    lang: Locale,
    page: string,
  }>,
};

// 번역 글은 태그가 없으므로 all 페이지뿐이다
async function TranslationListPage({ params }: Props) {
  const { lang, page } = await params;
  const currentPage = parseNumber(page, 1);

  if (currentPage === 1) {
    redirect('/translations/all');
  }

  if (currentPage > Math.ceil(allTranslationNumber / ITEMS_PER_PAGE)) {
    notFound();
  }

  const { pagePosts, totalPostNumber } = getTranslationsByPage({
    currentPage,
    postsPerPage: ITEMS_PER_PAGE,
  });

  const pagePostsWithThumbnail: PostIntroType[] = pagePosts.map((post) => {
    const { title, description, date, url, thumbnail } = post;
    return { title, description, date, url, thumbnail };
  });

  return (
    <>
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `/translations/all/${page}`}
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
        renderPageLink={(page: number) => `/translations/all/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
    </>
  );
}

export default TranslationListPage;

export function generateStaticParams() {
  const paths = [];

  for (let i = 0; i < allTranslationNumber / ITEMS_PER_PAGE + 2; i++) {
    for (const lang of i18n.locales) {
      paths.push({
        lang,
        page: (i + 1).toString(),
      });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: currentPage } = await params;

  return {
    title: `${blogLocalConfig.ko.title}, 번역 글 목록`,
    description: `${blogLocalConfig.ko.title}의 번역 글 목록 ${currentPage}페이지`,
    alternates: {
      canonical: `/translations/all/${currentPage}`,
    },
    openGraph: {
      title: `${blogLocalConfig.ko.title}, 번역 글 목록`,
      description: `${blogLocalConfig.ko.title}의 번역 글 목록 ${currentPage}페이지`,
      url: `/translations/all/${currentPage}`,
    },
  };
}
