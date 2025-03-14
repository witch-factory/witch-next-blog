import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useDebounce } from './useDebounce';

export function useSearchKeyword(): [string, string, (s: string) => void] {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // 초기 검색어 가져오기
  const initialKeyword = searchParams.get('search') ?? '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const debouncedKeyword = useDebounce(keyword, 300);

  const handleSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    }
    else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  // 디바운스된 키워드가 변경될 때 URL 업데이트
  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? '';

    if (debouncedKeyword !== currentSearch) {
      handleSearch(debouncedKeyword);
    }
  }, [debouncedKeyword, searchParams, pathname, router, handleSearch]);

  return [keyword, debouncedKeyword, setKeyword];
}
