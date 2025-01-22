export const i18n = {
  defaultLocale: 'ko',
  locales: ['ko', 'en'],
} as const;

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export type Locale = (typeof i18n)['locales'][number];
