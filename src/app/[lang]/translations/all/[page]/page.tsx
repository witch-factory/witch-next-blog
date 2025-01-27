import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { blogLocalConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import { i18n, Locale } from '@/types/i18n';
import Pagination from '@/ui/pagination';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE, allTranslationNumber } from '@/utils/content/helper';
import { getTranslationsByPage } from '@/utils/content/postMetadata';
import { parsePage } from '@/utils/parsePage';

type Props = {
  params: {
    lang: Locale,
    page: string,
  },
};

const content = {
  ko: {
    title: '번역한 글',
    description: '재미있게 읽은 글들을 한국어로 번역합니다.',
  },
  en: {
    title: 'Translations',
    description: 'I translate articles that I found interesting into Korean.',
  },
} as const satisfies Record<Locale, object>;

// 번역 글은 태그가 없으므로 all 페이지뿐이다
function TranslationListPage({ params }: Props) {
  const { lang } = params;
  const currentPage = parsePage(params.page);

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
      <h2>{content[lang].title}</h2>
      <p>
        {content[lang].description}
      </p>
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `/posts/all/${page}`}
        perPage={ITEMS_PER_PAGE}
      />
      <PostList lang={lang} postList={pagePostsWithThumbnail} />
      <Pagination
        totalItemNumber={totalPostNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `/posts/all/${page}`}
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

export function generateMetadata({ params }: Props): Metadata {
  const currentPage = params.page;

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
