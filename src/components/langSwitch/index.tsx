'use client';

import { usePathname, useRouter } from 'next/navigation';

import { i18n, Language, locales } from '@/types/i18n';

import * as styles from './styles.css';

const content = {
  ko: {
    title: '언어',
    label: '한국어',
    flag: '🇰🇷',
  },
  en: {
    title: 'Language',
    label: 'English',
    flag: '🇺🇸',
  },
} as const satisfies Record<Language, object>;

// TODO: 버튼 디자인 개선
export default function LanguageSwitcher({ lang }: { lang: Language }) {
  const pathname = usePathname(); // 현재 경로
  const router = useRouter();

  // 언어 교체
  const toggleLanguage = (newLang: Language) => {
    if (lang === newLang) return; // 같은 언어일 경우 무시

    const pathSegments = pathname.split('/').filter(Boolean); // 경로를 '/'로 나누고 빈 값 제거
    const currentLangIndex = locales.includes(pathSegments[0] as Language) ? 0 : -1;

    // 경로에 언어가 없는 경우
    if (currentLangIndex === -1) {
      const newPath = newLang === i18n.defaultLocale ? pathname : `/${newLang}${pathname}`;
      router.push(newPath);
      return;
    }

    // 언어가 있는 경우 기존 언어를 새 언어로 교체
    pathSegments[currentLangIndex] = newLang === i18n.defaultLocale ? '' : newLang;
    const newPath = `/${pathSegments.filter(Boolean).join('/')}`;
    router.push(newPath);
  };

  return (
    <nav className={styles.container}>
      {locales.map((locale) => (
        <button className={`${styles.button} ${locale === lang ? styles.activeButton : ''}`} key={locale} onClick={() => { toggleLanguage(locale); }}>
          {content[locale].flag}
          {' '}
          {content[locale].label}
        </button>
      ))}
    </nav>
  );
}
