'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Language, locales } from '@/types/i18n';

import * as styles from './styles.css';

const DEFAULT_LOCALE = 'ko';

// 현재 경로에서 언어 추출
// 없다면 null
const langMatch = (pathname: string) => {
  for (const lang of locales) {
    if (pathname.startsWith(`/${lang}`)) {
      return lang;
    }
  }
  return null;
};

// TODO: 버튼 디자인 개선, URL 변경을 세련되게
export default function LanguageSwitcher() {
  const pathname = usePathname(); // 현재 경로
  const router = useRouter();

  // TODO: 현재 활성화된 언어에 따라 스타일 분리
  const currentLang = langMatch(pathname);
  // 현재 경로에서 언어 추출

  const toggleLanguage = (newLang: Language) => {
    // 현재 경로에서 언어 부분(ko/en)을 교체
    // 이후 경로도 처리하도록 바꿔야

    console.log('pathname', pathname);
    console.log('currentLang', currentLang);
    console.log('newLang', newLang);
    // 같은 언어면 무시
    // 현재 언어가 기본언어고 바꿀 언어도 기본언어면 무시
    if (currentLang === newLang || (currentLang === null && newLang === DEFAULT_LOCALE)) return; // 같은 언어면 무시
    if (newLang === DEFAULT_LOCALE) {
      // 기본 언어로 바꾸는 경우
      if (pathname === '/' || pathname === `/${currentLang}`) {
        // 현재 경로가 기본 경로인 경우
        const newPath = `/`;
        router.push(newPath);
      }
      else {
        const newPath = pathname.replace(`/${currentLang}`, '');
        router.push(newPath);
      }
      return;
    }
    if (currentLang === null) {
      // 언어가 없는 경우
      const newPath = `/${newLang}${pathname}`; // 기본 경로 처리
      router.push(newPath); // 새 경로로 이동
      return;
    }
    else {
      // 현재 언어가 있는 경우
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      router.push(newPath);
    }
  };

  return (
    <nav>
      {locales.map((lang) => (
        <button className={styles.buttonStyle} key={lang} onClick={() => { toggleLanguage(lang); }}>
          {lang}
        </button>
      ))}
    </nav>
  );
}
