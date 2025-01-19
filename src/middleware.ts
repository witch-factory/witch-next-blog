import { NextRequest, NextResponse } from 'next/server';

import { i18n } from './types/i18n';

// 관련 next.js 문서
// https://nextjs.org/docs/app/building-your-application/routing/internationalization
// function getLocale(request: NextRequest): string {
//   const negotiatorHeaders: Record<string, string> = {};
//   request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
//   // @ts-expect-error locales are readonly
//   const locales: string[] = i18n.locales;

//   // Use negotiator and intl-localematcher to get best locale
//   const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
//     locales,
//   );

//   const locale = matchLocale(languages, locales, i18n.defaultLocale);

//   return locale;
// }

// 로케일이 없을 경우 rewrite역할
export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;

  // URL 경로에서 로케일 찾기
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    // 경로에 이미 로케일이 포함된 경우 추가 작업 없이 통과
    return NextResponse.next();
  }

  // 경로에 로케일이 없는 경우 기본 로케일의 컨텐츠를 보여주도록 rewrite
  request.nextUrl.pathname = `/${i18n.defaultLocale}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!static|.*\\..*|_next).*)',
    // Optional: only run on root (/) URL
    // '/'

  ],
};
