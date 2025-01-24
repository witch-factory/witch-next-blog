import { NextRequest, NextResponse } from 'next/server';

import { i18n, Locale, LOCALE_COOKIE_NAME } from '@/types/i18n';

export const dynamic = 'force-static';

// api/language?locale=ko 등 locale 쿼리스트링을 통해 언어 변경
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

  // // 이전 페이지의 URL을 referer 헤더를 통해 가져옴
  // const headersList = headers();
  // const refererUrl = new URL(headersList.get('referer') ?? blogConfig.ko.url);
  // const { origin, pathname } = refererUrl;

  // const newPath = generateRedirectPath(pathname, selectedLocale);
  // const redirectUrl = new URL(newPath, origin);

  // const response = NextResponse.redirect(redirectUrl);
  // response.cookies.set(LOCALE_COOKIE_NAME, selectedLocale, {
  //   path: '/',
  //   maxAge: 60 * 60 * 24 * 30, // 1달
  //   sameSite: 'lax',
  // });

  // return response;
}
