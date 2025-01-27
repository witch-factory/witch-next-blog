import { NextRequest, NextResponse } from 'next/server';

import { i18n, Locale, LOCALE_COOKIE_NAME } from '@/types/i18n';

export const dynamic = 'force-static';

// /[lang]/api/language의 lang 동적 라우트 세그먼트를 통해서 언어 변경
export function GET(request: NextRequest, { params }: {
  params: { lang: Locale },
}) {
  const selectedLocale = params.lang;

  // 유효하지 않은 로케일이면 406 Not Acceptable 에러
  if (!i18n.locales.includes(selectedLocale)) {
    return NextResponse.json(
      { error: 'Invalid locale' },
      { status: 406 },
    );
  }

  const response = NextResponse.json({ locale: selectedLocale });
  response.cookies.set(LOCALE_COOKIE_NAME, selectedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 1달
    sameSite: 'lax',
  });
  return response;
}
