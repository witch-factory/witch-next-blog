import { Locale } from '@/types/i18n';

export const toISODate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// TODO: 언어에 따른 날짜 포매팅
export const formatDate = (date: Date, lang: Locale) => {
  const formatter = new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  return formatter.format(date);
};
