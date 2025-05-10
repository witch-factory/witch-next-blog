import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

import { i18n, Locale, LOCALE_COOKIE_NAME } from './constants/i18n';

// 미들웨어에서 로케일 콘텐츠 협상
/*
로직
1. 사용자가 접근한 URL에 로케일을 갖고 있으면 해당 로케일로 결정
2. 사용자의 쿠키 검사 -> 쿠키에 사용자가 설정했던 로케일이 있으면 해당 로케일로 결정
3. 쿠키에 로케일이 없으면 브라우저의 Accept-Language 헤더를 기반으로 로케일 결정
4. 로케일이 결정되지 않았다면 기본 로케일로 결정
-> 언어 전환 시 쿠키에 저장하는 건 route handler에서 처리
*/

// 관련 next.js 문서
// https://nextjs.org/docs/app/building-your-application/routing/internationalization
// 사용자가 접근한 URL에 로케일이 없을 경우 처리하는 로직
// 쿠키 검사, Accept-Language 헤더를 기반으로 하는 검사
function getUserLocale(request: NextRequest): string {
  // 2. 사용자의 쿠키 검사 -> 쿠키에 사용자가 설정했던 로케일이 있으면 해당 로케일로 결정
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined;
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 3. 쿠키에 로케일이 없으면 브라우저의 Accept-Language 헤더를 기반으로 로케일 결정
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

// 로케일이 없을 경우 rewrite역할
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 사용자가 접근한 URL에서 로케일을 갖고 있으면 해당 로케일로 결정
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) {
    // 경로에 이미 로케일이 포함된 경우 추가 작업 없이 통과
    return NextResponse.next();
  }

  const userLocale = getUserLocale(request);

  const newPath = `/${userLocale}${pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = newPath;

  // const response = userLocale === i18n.defaultLocale
  //   ? NextResponse.rewrite(url)
  //   : NextResponse.redirect(url);

  // return response;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!static|.*\\..*|_next).*)',
    // Optional: only run on root (/) URL
    // '/'

  ],
};
