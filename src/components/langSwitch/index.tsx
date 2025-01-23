'use client';

import { useRouter } from 'next/navigation';

import { i18n, Locale } from '@/types/i18n';

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

// TODO: 버튼 디자인 개선
export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const router = useRouter();

  // 언어 교체
  // TODO: useTransition을 이용한 전환 동작 최적화
  const toggleLanguage = async (newLang: Locale) => {
    if (lang === newLang) return; // 같은 언어일 경우 무시

    try {
      const response = await fetch(`/api/language?locale=${newLang}`);

      if (!response.ok) {
        throw new Error('Language change failed');
      }

      const redirectUrl = response.url;
      router.push(redirectUrl);
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
          onClick={() => { void toggleLanguage(locale); }}
          aria-label={content[locale].ariaLabel}
        >
          <span role="img" aria-hidden="true">{content[locale].flag}</span>
          {' '}
          {content[locale].label}
        </button>
      ))}
    </nav>
  );
}
