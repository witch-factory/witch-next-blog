'use client';

import { useEffect, useState } from 'react';

import { PostIntroType } from '@/types/components';
import { Locale } from '@/types/i18n';
import PostList from '@/ui/postList';
import { getSearchPosts } from '@/utils/content/postMetadata';
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

type SearchResult = {
  searchResults: string[],
};

async function fetchSearchResults(keyword: string, lang: Locale): Promise<string[]> {
  const response = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}&lang=${lang}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch search results: ${response.statusText}`);
  }

  const data = await response.json() as SearchResult;
  return data.searchResults;
}

function PostSearchPage({ params }: Props) {
  const { lang } = params;
  const [searchKeyword, debouncedKeyword, setSearchKeyword] = useSearchKeyword();
  const [filteredPostList, setFilteredPostList] = useState<PostIntroType[]>(() => getSearchPosts(lang));
  const [isLoading, setIsLoading] = useState(false);

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchSearchResults(debouncedKeyword, lang).then((results) => {
      const formattedResults = results.map((result) => JSON.parse(result) as PostIntroType);

      setFilteredPostList(formattedResults);
    }).catch((error: unknown) => {
      console.error(error);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [debouncedKeyword, lang]);

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
      {
        isLoading
          ? <p>Loading...</p>
          : <PostList lang={lang} postList={filteredPostList} />
      }
    </>
  );
}

export default PostSearchPage;
