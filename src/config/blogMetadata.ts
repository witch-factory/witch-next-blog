import { Metadata } from 'next';

import { generateBlogLocalMetadata } from '@/builder/metadata';
import { Locale } from '@/constants/i18n';

import { blogLocalConfig } from './blogConfig';

export const blogMetadata: Record<Locale, Metadata> = {
  ko: generateBlogLocalMetadata(blogLocalConfig, 'ko'),
  en: generateBlogLocalMetadata(blogLocalConfig, 'en'),
};
