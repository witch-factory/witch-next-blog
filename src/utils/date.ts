import { Locale } from '@/constants/i18n';

export const toISODate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const formatDate = (date: Date, lang: Locale) => {
  const formatter = new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: lang === 'ko' ? 'long' : 'short',
    day: 'numeric',
  });

  return formatter.format(date);
};
