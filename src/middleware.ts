import { NextRequest, NextResponse } from 'next/server';

import { locales } from './types/i18n';

// Get the preferred locale, similar to the above or using a library

const DEFAULT_LOCALE = 'ko';

// 매칭되는 언어가 없으면 null
const langMatch = (pathname: string) => {
  for (const lang of locales) {
    if (pathname.startsWith(`/${lang}`)) {
      return lang;
    }
  }
  return null;
};

// 로케일이 없을 경우 rewrite역할
export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = langMatch(pathname);

  if (pathnameHasLocale) return;

  // 파일은 rewrite에서 제외해야
  request.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  // console.log('Redirecting to', request.nextUrl);
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
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
