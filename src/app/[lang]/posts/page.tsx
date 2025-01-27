'use client';

import { useCallback, ChangeEvent, useEffect, useState, useRef, useMemo } from 'react';

import { PostIntroType } from '@/types/components';
import { Locale } from '@/types/i18n';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE } from '@/utils/content/helper';
import { useDebounce } from '@/utils/useDebounce';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import { useSearchKeyword } from '@/utils/useSearchKeyword';

import { inputStyle } from './styles.css';

type Props = {
  params: {
    lang: Locale,
  },
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

type SearchResult = {
  searchResults: string[],
};

async function fetchSearchResults(keyword: string, lang: Locale, page: number): Promise<string[]> {
  const response = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}&lang=${lang}&page=${page}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch search results: ${response.statusText}`);
  }

  const data = await response.json() as SearchResult;
  return data.searchResults;
}

function PostSearchPage({ params }: Props) {
  const { lang } = params;
  const [searchKeyword, debouncedKeyword, setSearchKeyword] = useSearchKeyword();
  // TODO: post 정보를 가져와서 타입으로 쓰도록 하기
  const [filteredPostList, setFilteredPostList] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedPage = useDebounce(page, 300);

  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const totalPage = Math.ceil(filteredPostList.length / ITEMS_PER_PAGE);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await fetchSearchResults(debouncedKeyword, lang, page);
      setFilteredPostList((prev) => (page === 1 ? results : [...prev, ...results]));
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }, [debouncedKeyword, lang, page]);

  useEffect(() => {
    setPage(1); // Reset to first page when keyword changes
  }, [debouncedKeyword]);

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  // useEffect(() => {
  //   setFilteredPostList(filterPostsByKeyword(searchPosts, debouncedKeyword));
  // }, [debouncedKeyword, searchPosts]);

  useInfiniteScroll(infiniteScrollRef, useCallback(() => {
    if (debouncedPage < totalPage) {
      setPage((prev) => prev + 1);
    }
  }, [totalPage, debouncedPage]));

  return (
    <>
      <h2>{content[lang].title}</h2>
      <input
        className={inputStyle}
        placeholder={content[lang].placeholder}
        value={searchKeyword}
        onChange={handleKeywordChange}
      />
      {filteredPostList.length === 0
        ? <p>{content[lang].noResult}</p>
        : null}
      {
        isLoading
          ? <p>Loading...</p>
          : (
              <p>
                {filteredPostList.slice(0, ITEMS_PER_PAGE * page).map((post) => (
                  <div key={post}>
                    {post}
                  </div>
                ))}
              </p>
            )
      }
      {/* <PostList lang={lang} postList={filteredPostList.slice(0, ITEMS_PER_PAGE * page)} /> */}
      <div ref={infiniteScrollRef} />
    </>
  );
}

export default PostSearchPage;
