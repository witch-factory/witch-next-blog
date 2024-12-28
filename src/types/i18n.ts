export const locales = ['ko', 'en'] as const; // 지원하는 언어

export type Language = typeof locales[number];
