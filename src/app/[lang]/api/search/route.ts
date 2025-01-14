import { NextRequest } from 'next/server';

import { enIndex, koIndex } from './searchIndex';

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword') ?? ''; // 빈 문자열에 대한 처리 필요. 모든 결과를 보여줘야 하는데 지금은 아님
  const lang = searchParams.get('lang') ?? 'ko'; // 기본값: 한국어

  // 언어에 따라 적절한 인덱스 선택
  const index = lang === 'en' ? enIndex : koIndex;

  // 10개까지의 limit
  const searchResults = index.search(keyword, 10);

  return new Response(JSON.stringify({ searchResults }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
