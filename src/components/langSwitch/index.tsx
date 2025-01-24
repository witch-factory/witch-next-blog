'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

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

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // 언어 교체
  const toggleLanguage = (newLang: Locale) => {
    if (lang === newLang) return; // 같은 언어일 경우 무시

    const redirectPath = generateRedirectPath(pathname, newLang);
    try {
      fetch(`/${newLang}/api/language`).catch((error: unknown) => {
        console.error('Failed to change language:', error);
      });

      startTransition(() => {
        router.replace(redirectPath);
      });
      // const redirectUrl = response.url;
      // startTransition(() => {
      //   router.replace(redirectUrl);
      //   // scroll: false로 변경하면 페이지 이동 시 스크롤이 맨 위로 이동하지 않음
      //   // router.push(redirectUrl, { scroll: false });
      // });
    }
    catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <nav className={styles.container}>
      {i18n.locales.map((locale) => (
        <button
          className={`${styles.button} ${locale === lang ? styles.activeButton : ''}`}
          key={locale}
          onClick={() => { toggleLanguage(locale); }}
          aria-label={content[locale].ariaLabel}
          aria-current={locale === lang ? 'page' : undefined}
          disabled={isPending}
        >
          <span role="img" aria-hidden="true">{content[locale].flag}</span>
          {' '}
          {content[locale].label}
        </button>
      ))}
    </nav>
  );
}
