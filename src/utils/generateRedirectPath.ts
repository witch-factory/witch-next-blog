import { i18n, Locale } from '@/types/i18n';

// 주어진 pathname과 선택된 로케일을 이용해
// 선택된 로케일에서 해당 경로의 컨텐츠로 갈 수 있는 리다이렉트 경로 생성
export function generateRedirectPath(pathname: string, selectedLocale: Locale) {
  const pathSegments = pathname.split('/').filter(Boolean); // 경로를 '/'로 나누고 빈 값 제거
  const currentLangIndex = i18n.locales.includes(pathSegments[0] as Locale) ? 0 : -1;

  // 경로에 언어가 없는 경우 추가
  if (currentLangIndex === -1) {
    return `/${selectedLocale}${pathname}`;
    // return selectedLocale === i18n.defaultLocale ? pathname : `/${selectedLocale}${pathname}`;
  }

  // 언어가 있는 경우 해당 언어로 변경
  pathSegments[currentLangIndex] = selectedLocale;
  return `/${pathSegments.filter(Boolean).join('/')}`;
}
