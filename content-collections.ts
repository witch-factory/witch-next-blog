import path from 'node:path';

import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMarkdown } from '@content-collections/markdown';
import { z } from 'zod';

import { Locale } from '@/constants/i18n';

type DocumentKind = Locale | 'translation';

function getSlugFromFilePath(filePath: string) {
  return path.basename(path.dirname(filePath));
}

const createUrl = (slug: string, kind: DocumentKind) => {
  switch (kind) {
    case 'ko':
    case 'en':
      return `/posts/${slug}`;
    case 'translation':
      return `/translations/${slug}`;
    default:
        kind satisfies never;
      return '';
  }
};

const basePostSchema = z.object({
  title: z.string().max(99),
  date: z.iso.datetime(),
  description: z.string().max(200),
  content: z.string(),
  tags: z.array(z.string()).default([]),
});

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.md',
  schema: basePostSchema,
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    const slug = getSlugFromFilePath(document._meta.filePath);

    return {
      ...document,
      slug,
      url: createUrl(slug, 'ko'),
      html,
    };
  },
});

const enPosts = defineCollection({
  name: 'enPosts',
  directory: 'content/en-posts',
  include: '**/*.md',
  schema: basePostSchema,
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    const slug = getSlugFromFilePath(document._meta.filePath);
    return {
      ...document,
      slug,
      url: createUrl(slug, 'en'),
      html,
    };
  },
});

const translations = defineCollection({
  name: 'translations',
  directory: 'content/translations',
  include: '**/*.md',
  schema: basePostSchema,
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    const slug = getSlugFromFilePath(document._meta.filePath);
    return {
      ...document,
      slug,
      url: createUrl(slug, 'translation'),
      html,
    };
  },
});

export default defineConfig({
  content: [posts, enPosts, translations],
});
