export const i18n = {
  defaultLocale: 'ko',
  locales: ['ko', 'en'],
} as const;

export const locales = ['ko', 'en'] as const; // 지원하는 언어

export type Language = typeof locales[number];

export type Locale = (typeof i18n)['locales'][number];
