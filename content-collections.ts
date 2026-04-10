import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMarkdown } from '@content-collections/markdown';
import { z } from 'zod';

// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.md',
  schema: z.object({
    title: z.string().max(99),
    description: z.string().max(200),
    date: z.iso.datetime(),
    tags: z.array(z.string()).default([]),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    return {
      ...document,
      html,
    };
  },
});

export default defineConfig({
  content: [posts],
});
