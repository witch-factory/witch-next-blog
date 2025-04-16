'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { i18n, Locale } from '@/types/i18n';
import { generateRedirectPath } from '@/utils/generateRedirectPath';

import * as styles from './styles.css';

const content = {
  ko: {
    title: '언어',
    label: '한국어',
    flag: '🇰🇷',
    ariaLabel: '한국어로 변경',
  },
  en: {
    title: 'Language',
    label: 'English',
    flag: '🇺🇸',
    ariaLabel: 'Switch to English',
  },
} as const satisfies Record<Locale, object>;

// todo: segmented control로 리팩토링
// https://designbase.co.kr/dictionary/segmented-control/
export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  // 언어 교체
  const toggleLanguage = (newLang: Locale) => {
    if (lang === newLang) return; // 같은 언어일 경우 무시

    fetch(`/${newLang}/api/language`).catch((error: unknown) => {
      console.error('Failed to change language:', error);
    });
  };

  return (
    <nav className={styles.container}>
      {i18n.locales.map((locale) => {
        const redirectPath = generateRedirectPath(pathname, locale);

        return (
          <Link
            href={redirectPath}
            // replace
            className={`${styles.button} ${locale === lang ? styles.activeButton : ''}`}
            key={locale}
            onClick={() => { toggleLanguage(locale); }}
            aria-label={content[locale].ariaLabel}
            aria-current={locale === lang ? 'page' : undefined}
          >
            <span role="img" aria-hidden="true">{content[locale].flag}</span>
            {' '}
            {content[locale].label}
          </Link>
        );
      })}
    </nav>
  );
}
