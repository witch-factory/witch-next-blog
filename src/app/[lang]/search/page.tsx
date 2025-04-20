'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, use, useCallback, useEffect, useMemo, useState } from 'react';

import { PostIntroType } from '@/types/components';
import { Locale } from '@/types/i18n';
import Heading from '@/ui/heading';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE } from '@/utils/content/helper';
import { getSearchPosts } from '@/utils/content/postMetadata';
import { filterPostsByKeyword } from '@/utils/filterPosts';
import { useDebounce } from '@/utils/useDebounce';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';

import * as styles from './styles.css';

type Props = {
  params: Promise<{
    lang: Locale,
  }>,
};

const content = {
  ko: {
    title: '글 검색',
    placeholder: '검색어를 입력하세요',
    noResult: '검색 결과가 없습니다.',
  },
  en: {
    title: 'Search Posts',
    placeholder: 'Enter a search keyword',
    noResult: 'No search results.',
  },
} as const satisfies Record<Locale, { title: string, placeholder: string, noResult: string }>;

function SearchInput({ lang, onKeywordChange }: { lang: Locale, onKeywordChange: (keyword: string) => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialKeyword = searchParams.get('search') ?? '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const debouncedKeyword = useDebounce(keyword, 300);

  const updateURL = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    }
    else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  useEffect(() => {
    updateURL(debouncedKeyword);
    onKeywordChange(debouncedKeyword);
  }, [debouncedKeyword, updateURL, onKeywordChange]);

  return (
    <input
      className={styles.inputStyle}
      placeholder={content[lang].placeholder}
      value={keyword}
      onChange={(e) => { setKeyword(e.target.value); }}
    />
  );
}

function PostSearchPage({ params }: Props) {
  const { lang } = use(params);

  const searchPosts = useMemo(() => getSearchPosts(lang), [lang]);
  const [filteredPostList, setFilteredPostList] = useState<PostIntroType[]>(searchPosts);
  const [page, setPage] = useState<number>(1);
  const debouncedPage = useDebounce(page, 300);

  const totalPage = Math.ceil(filteredPostList.length / ITEMS_PER_PAGE);

  const { ref: infiniteScrollRef } = useInfiniteScroll(useCallback(() => {
    if (debouncedPage < totalPage) {
      setPage((prev) => prev + 1);
    }
  }, [totalPage, debouncedPage]));

  const handleKeywordChange = useCallback((keyword: string) => {
    setPage(1);
    setFilteredPostList(filterPostsByKeyword(searchPosts, keyword));
  }, [searchPosts]);

  return (
    <>
      <Heading as="h2" size="md">
        {content[lang].title}
      </Heading>
      <Suspense fallback={<p>{content[lang].placeholder}</p>}>
        <SearchInput lang={lang} onKeywordChange={handleKeywordChange} />
      </Suspense>
      {filteredPostList.length === 0
        ? <p>{content[lang].noResult}</p>
        : null}
      <PostList lang={lang} postList={filteredPostList.slice(0, ITEMS_PER_PAGE * page)} />
      <div ref={infiniteScrollRef} />
    </>
  );
}

export default PostSearchPage;
