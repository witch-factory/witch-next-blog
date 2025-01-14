import { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');
  const lang = searchParams.get('lang');

  return new Response(JSON.stringify({ keyword, lang }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
