'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { PostIntroType } from '@/types/components';
import { Locale } from '@/types/i18n';
import PostList from '@/ui/postList';
import { ITEMS_PER_PAGE } from '@/utils/content/helper';
import { getSearchPosts } from '@/utils/content/postMetadata';
import { filterPostsByKeyword } from '@/utils/filterPosts';
import { useDebounce } from '@/utils/useDebounce';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';
import { useSearchKeyword } from '@/utils/useSearchKeyword';

import * as styles from './styles.css';

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
  const { lang } = params;
  const searchPosts = useMemo(() => getSearchPosts(lang), [lang]);
  const [searchKeyword, debouncedKeyword, setSearchKeyword] = useSearchKeyword();
  const [filteredPostList, setFilteredPostList] = useState<PostIntroType[]>(searchPosts);
  const [page, setPage] = useState<number>(1);
  const debouncedPage = useDebounce(page, 300);

  const totalPage = Math.ceil(filteredPostList.length / ITEMS_PER_PAGE);

  const { ref: infiniteScrollRef } = useInfiniteScroll(useCallback(() => {
    if (debouncedPage < totalPage) {
      setPage((prev) => prev + 1);
    }
  }, [totalPage, debouncedPage]));

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
    setPage(1);
  };

  useEffect(() => {
    setFilteredPostList(filterPostsByKeyword(searchPosts, debouncedKeyword));
  }, [debouncedKeyword, searchPosts]);

  return (
    <>
      <h2>{content[lang].title}</h2>
      <p>상위 10개의 검색 결과가 표시됩니다.</p>
      <input
        className={styles.inputStyle}
        placeholder={content[lang].placeholder}
        value={searchKeyword}
        onChange={handleKeywordChange}
      />
      {filteredPostList.length === 0
        ? <p>{content[lang].noResult}</p>
        : null}
      <PostList lang={lang} postList={filteredPostList.slice(0, ITEMS_PER_PAGE * page)} />
      <div ref={infiniteScrollRef} />
    </>
  );
}

export default PostSearchPage;
