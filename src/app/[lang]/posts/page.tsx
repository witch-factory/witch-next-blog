'use client';

import { useCallback, ChangeEvent, useEffect, useState, useRef, useMemo } from 'react';

import { PostIntroType } from '@/types/components';
import { Locale } from '@/types/i18n';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE } from '@/utils/content/helper';
import { getSearchPosts } from '@/utils/content/postMetadata';
import { filterPostsByKeyword } from '@/utils/filterPosts';
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

function PostSearchPage({ params }: Props) {
  const lang = params.lang;
  const searchPosts: PostIntroType[] = useMemo(() => getSearchPosts(lang), [lang]);
  const [searchKeyword, debouncedKeyword, setSearchKeyword] = useSearchKeyword();
  const [filteredPostList, setFilteredPostList] = useState<PostIntroType[]>(searchPosts);
  const [page, setPage] = useState<number>(1);
  const debouncedPage = useDebounce(page, 300);

  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const totalPage = Math.ceil(filteredPostList.length / ITEMS_PER_PAGE);

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  useEffect(() => {
    setFilteredPostList(filterPostsByKeyword(searchPosts, debouncedKeyword));
  }, [debouncedKeyword, searchPosts]);

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
        onChange={onKeywordChange}
      />
      {filteredPostList.length === 0
        ? <p>{content[lang].noResult}</p>
        : null}
      <PostList postList={filteredPostList.slice(0, ITEMS_PER_PAGE * page)} />
      <div ref={infiniteScrollRef} />
    </>
  );
}

export default PostSearchPage;
