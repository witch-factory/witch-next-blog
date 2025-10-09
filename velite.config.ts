import dockerfile from 'highlight.js/lib/languages/dockerfile';
import lisp from 'highlight.js/lib/languages/lisp';
import nginx from 'highlight.js/lib/languages/nginx';
import { common } from 'lowlight';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { defineConfig, defineCollection, s, z } from 'velite';

import prisma from '@/bin/prisma-highlight';
import { generateRssFeed } from '@/builder/rss';
import { uploadThumbnail } from '@/builder/uploadThumbnail';
import remarkHeadingTree from '@/plugins/remark-heading-tree';
import { createTagSlug } from '@/utils/core/string';
import {
  translationSchema,
  translationMetadataSchema,
  koArticleSchema,
  koArticleMetadataSchema,
  enArticleSchema,
  enArticleMetadataSchema,
  metadataSchema,
} from 'schema';

const posts = defineCollection({
  name: 'Post', // collection type name
  pattern: 'posts/**/*.md', // content files glob pattern
  schema: koArticleSchema,
});

const postMetadata = defineCollection({
  name: 'PostMetadata', // collection type name
  pattern: 'posts/**/*.md', // content files glob pattern
  schema: koArticleMetadataSchema,
});

// AI로 번역한 영어 글의 스키마
const enPosts = defineCollection({
  name: 'EnPost',
  pattern: 'en-posts/**/*.md',
  schema: enArticleSchema,
});

const enPostMetadata = defineCollection({
  name: 'EnPostMetadata',
  pattern: 'en-posts/**/*.md',
  schema: enArticleMetadataSchema,
});

const postTags = defineCollection({
  name: 'Tag',
  pattern: [],
  schema: s.object({
    name: s.string(),
    slug: s.slug('global', ['all']),
    count: s.number(),
  })
    .transform((data) => ({ ...data, url: `/${data.slug}` })),
});

const enPostTags = defineCollection({
  name: 'EnTag',
  pattern: [],
  schema: s.object({
    name: s.string(),
    slug: s.slug('global', ['all']),
    count: s.number(),
  })
    .transform((data) => ({ ...data, url: `/${data.slug}` })),
});

const translations = defineCollection({
  name: 'Translation',
  pattern: 'translations/**/*.md',
  schema: translationSchema,
});

const translationsMetadata = defineCollection({
  name: 'TranslationMetadata',
  pattern: 'translations/**/*.md',
  schema: translationMetadataSchema,
});

// const darkPinkTheme = JSON.parse(fs.readFileSync('./public/themes/dark-pink-theme.json', 'utf8')) as Theme;

// const rehypePrettyCodeOptions = {
//   theme: {
//     light: 'github-light',
//     pink: 'light-plus',
//     dark: 'github-dark',
//     darkPink: darkPinkTheme,
//   },
// };

const rehypeHighlightOptions = {
  languages: {
    ...common,
    lisp,
    nginx,
    dockerfile,
    prisma,
  },
};

export default defineConfig({
  root: 'content',
  collections: {
    posts,
    postMetadata,
    postTags,
    enPosts,
    enPostMetadata,
    enPostTags,
    translations,
    translationsMetadata,
  },
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name].[ext]',
    clean: true,
  },
  markdown: {
    remarkPlugins: [remarkMath, remarkHeadingTree],
    rehypePlugins: [
      // [rehypePrettyCode, rehypePrettyCodeOptions],
      rehypeKatex,
      [rehypeHighlight, rehypeHighlightOptions],
    ],
  },
  prepare: (collections) => {
    const { postMetadata, enPostMetadata } = collections;
    // TODO: 태그 데이터 생성하는 이 부분 리팩토링
    const allTagsFromPosts = new Set<string>(postMetadata.flatMap((post) => post.tags));
    const tagsData = Array.from(allTagsFromPosts).map((tag) => {
      return {
        name: tag,
        slug: createTagSlug(tag),
        count: postMetadata.filter((post) => post.tags.includes(tag)).length,
        url: `/ko/posts/tag/${createTagSlug(tag)}`,
      };
    });
    collections.postTags = [
      {
        name: 'All',
        slug: 'all',
        count: postMetadata.length,
        url: '/ko/posts/tag/all',
      },
      ...tagsData,
    ];

    const allTagsFromEnPosts = new Set<string>(enPostMetadata.flatMap((post) => post.tags));
    const enTagsData = Array.from(allTagsFromEnPosts).map((tag) => {
      return {
        name: tag,
        slug: createTagSlug(tag),
        count: enPostMetadata.filter((post) => post.tags.includes(tag)).length,
        url: `/en/posts/tag/${createTagSlug(tag)}`,
      };
    });
    collections.enPostTags = [
      {
        name: 'All',
        slug: 'all',
        count: enPostMetadata.length,
        url: '/en/posts/tag/all',
      },
      ...enTagsData,
    ];
  },
  // after the output assets are generated
  // upload the thumbnail to cloudinary
  complete: async ({ postMetadata, enPostMetadata, translationsMetadata }) => {
    generateRssFeed();
    await completeThumbnail(postMetadata);
    await completeThumbnail(enPostMetadata);
    await completeThumbnail(translationsMetadata);
  },

});

type Data = z.infer<typeof metadataSchema>;

async function completeThumbnail(metadata: Data[]) {
  await Promise.all(metadata.map(async (item) => {
    try {
      if (!item.thumbnail) {
        throw new Error('Thumbnail is not defined in the metadata');
      }
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
      }

      // 로컬 이미지 업로드
      if (item.thumbnail.local.startsWith('/')) {
        await uploadThumbnail(item.thumbnail.local);
      }
    }
    catch (e) {
      console.error(e);
    }
  }));
}
