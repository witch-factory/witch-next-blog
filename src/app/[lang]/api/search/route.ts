import { NextRequest } from 'next/server';

import { Locale } from '@/types/i18n';
import { ITEMS_PER_PAGE } from '@/utils/content/helper';
import { getSearchPosts } from '@/utils/content/postMetadata';

import { enIndex, koIndex } from './searchIndex';

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword') ?? ''; // 검색어가 없을 경우 빈 문자열
  const lang = (searchParams.get('lang') ?? 'ko') as Locale; // 기본값: 한국어

  if (keyword === '') {
    return new Response(JSON.stringify({ searchResults: getSearchPosts(lang).map((p) => JSON.stringify(p)) }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 언어에 따라 적절한 인덱스 선택
  const index = lang === 'en' ? enIndex : koIndex;

  // 10개까지의 limit
  const searchResults = index.search(keyword, ITEMS_PER_PAGE);

  return new Response(JSON.stringify({ searchResults }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
