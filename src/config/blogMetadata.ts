import { Metadata } from 'next';

import { Locale } from '@/types/i18n';
import { generateBlogLocalMetadata } from '@/utils/meta/helper';

import { blogLocalConfig } from './blogConfig';

export const blogMetadata: Record<Locale, Metadata> = {
  ko: generateBlogLocalMetadata(blogLocalConfig, 'ko'),
  en: generateBlogLocalMetadata(blogLocalConfig, 'en'),
};
