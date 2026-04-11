import path from 'node:path';

import { defineCollection, defineConfig } from '@content-collections/core';
import { z } from 'zod';

import { compileCustomMarkdown } from '@/builder/compileCustomMarkdown';
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
});

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.md',
  schema: basePostSchema.extend({
    tags: z.array(z.string()),
  }),
  transform: async (document, context) => {
    const { html, headingTree } = await compileCustomMarkdown(context, document);
    const slug = getSlugFromFilePath(document._meta.filePath);

    return {
      ...document,
      slug,
      url: createUrl(slug, 'ko'),
      html,
      headingTree,
    };
  },
});

const enPosts = defineCollection({
  name: 'enPosts',
  directory: 'content/en-posts',
  include: '**/*.md',
  schema: basePostSchema.extend({
    tags: z.array(z.string()),
  }),
  transform: async (document, context) => {
    const { html, headingTree } = await compileCustomMarkdown(context, document, 'en');
    const slug = getSlugFromFilePath(document._meta.filePath);
    return {
      ...document,
      slug,
      url: createUrl(slug, 'en'),
      html,
      headingTree,
    };
  },
});

const translations = defineCollection({
  name: 'translations',
  directory: 'content/translations',
  include: '**/*.md',
  schema: basePostSchema,
  transform: async (document, context) => {
    const { html, headingTree } = await compileCustomMarkdown(context, document, 'translation');
    const slug = getSlugFromFilePath(document._meta.filePath);
    return {
      ...document,
      slug,
      url: createUrl(slug, 'translation'),
      html,
      headingTree,
    };
  },
});

export default defineConfig({
  content: [posts, enPosts, translations],
});
