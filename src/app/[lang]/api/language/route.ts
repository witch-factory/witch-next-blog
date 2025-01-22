import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { blogConfig } from '@/config/blogConfig';
import { i18n, Locale, LOCALE_COOKIE_NAME } from '@/types/i18n';

// api/language?locale=ko 등 locale 쿼리스트링을 통해 언어 변경
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const selectedLocale = searchParams.get('locale');

  // 유효하지 않은 로케일이면 400 에러
  if (!selectedLocale || !i18n.locales.includes(selectedLocale as Locale)) {
    return NextResponse.json(
      { error: 'Invalid locale' },
      { status: 400 },
    );
  }

  // 이전 페이지 URL 가져오기 (없으면 홈으로)
  const headersList = headers();
  // referer부터 다시 찬찬히 해보자고
  const referer = headersList.get('referer') ?? blogConfig.ko.url;
  const redirectUrl = new URL(referer);
  const { pathname } = redirectUrl;

  const pathSegments = pathname.split('/').filter(Boolean); // 경로를 '/'로 나누고 빈 값 제거
  const currentLangIndex = i18n.locales.includes(pathSegments[0] as Locale) ? 0 : -1;

  // 경로에 언어가 없는 경우
  if (currentLangIndex === -1) {
    // URL basename이 없어서 에러 뜨는 듯?
    const newPath = selectedLocale === i18n.defaultLocale ? pathname : `/${selectedLocale}${pathname}`;
    const response = NextResponse.redirect(newPath);
    response.cookies.set(LOCALE_COOKIE_NAME, selectedLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1년
      sameSite: 'lax',
    });
    return response;
  }

  pathSegments[currentLangIndex] = selectedLocale === i18n.defaultLocale ? '' : selectedLocale;
  const newPath = `/${pathSegments.filter(Boolean).join('/')}`;

  const response = NextResponse.redirect(newPath);
  response.cookies.set(LOCALE_COOKIE_NAME, selectedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1년
    sameSite: 'lax',
  });

  return response;
}
