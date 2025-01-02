'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Language, locales } from '@/types/i18n';

import * as styles from './styles.css';

const DEFAULT_LOCALE = 'ko';

const content = {
  ko: {
    title: '언어',
    label: 'KO',
    flag: '🇰🇷',
  },
  en: {
    title: 'Language',
    label: 'EN',
    flag: '🇺🇸',
  },
} as const satisfies Record<Language, object>;

// TODO: 버튼 디자인 개선
export default function LanguageSwitcher({ lang }: { lang: Language }) {
  const pathname = usePathname(); // 현재 경로
  const router = useRouter();

  // 언어 교체
  const toggleLanguage = (newLang: Language) => {
    // 같은 언어면 무시
    if (lang === newLang) return;
    // 한국어 -> 다른 언어
    if (lang === DEFAULT_LOCALE) {
      const newPath = `/${newLang}${pathname}`;
      router.push(newPath);
      return;
    }
    // 다른 언어 -> 한국어
    if (newLang === DEFAULT_LOCALE) {
      if (pathname === '/' || pathname === `/${lang}`) {
        const newPath = '/';
        router.push(newPath);
      }
      else {
        const newPath = pathname.replace(`/${lang}`, '');
        router.push(newPath);
      }
      return;
    }
    // 다른 언어 -> 다른 언어
    else {
      const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
      router.push(newPath);
      return;
    }
  };

  return (
    <nav className={styles.container}>
      <h3 className={styles.title}>{content[lang].title}</h3>
      <div className={styles.buttonContainer}>
        {locales.map((locale) => (
          <button className={`${styles.button} ${locale === lang ? styles.activeButton : ''}`} key={locale} onClick={() => { toggleLanguage(locale); }}>
            {content[locale].flag}
            {' '}
            {content[locale].label}
          </button>
        ))}
      </div>
    </nav>
  );
}
