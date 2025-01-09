import fs from 'fs';

import rehypeKatex from 'rehype-katex';
import rehypePrettyCode, { Theme } from 'rehype-pretty-code';
import remarkMath from 'remark-math';
import { defineConfig, defineCollection, s, z } from 'velite';

import remarkHeadingTree from '@/plugins/remark-heading-tree';
import { ThumbnailType } from '@/types/components';
import { uploadThumbnail } from '@/utils/cloudinary';
import { getBase64ImageUrl } from '@/utils/generateBlurPlaceholder';
import { generateRssFeed } from '@/utils/generateRSSFeed';
import { slugify } from '@/utils/post';

import { metadataObject, articleSchema, articleMetadataSchema, enArticleSchema, translationSchema, translationMetadataSchema, enArticleMetadataSchema } from 'schema';
import rehypeHighlight from 'rehype-highlight';

const posts = defineCollection({
  name: 'Post', // collection type name
  pattern: 'posts/**/*.md', // content files glob pattern
  schema: articleSchema(),
});

const postMetadata = defineCollection({
  name: 'PostMetadata', // collection type name
  pattern: 'posts/**/*.md', // content files glob pattern
  schema: articleMetadataSchema(),
});

// AI로 번역한 영어 글의 스키마
const enPosts = defineCollection({
  name: 'EnPost',
  pattern: 'en-posts/**/*.md',
  schema: enArticleSchema(),
});

const enPostMetadata = defineCollection({
  name: 'EnPostMetadata',
  pattern: 'en-posts/**/*.md',
  schema: enArticleMetadataSchema(),
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
    .transform((data) => ({ ...data, url: `/en/${data.slug}` })),
});

const translations = defineCollection({
  name: 'Translation',
  pattern: 'translations/**/*.md',
  schema: translationSchema(),
});

const translationsMetadata = defineCollection({
  name: 'TranslationMetadata',
  pattern: 'translations/**/*.md',
  schema: translationMetadataSchema(),
});

const darkPinkTheme = JSON.parse(fs.readFileSync('./public/themes/dark-pink-theme.json', 'utf8')) as Theme;

const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    pink: 'light-plus',
    dark: 'github-dark',
    darkPink: darkPinkTheme,
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
    name: '[name]-[hash:8].[ext]',
    clean: true,
  },
  markdown: {
    remarkPlugins: [remarkMath, remarkHeadingTree],
    rehypePlugins: [
      // [rehypePrettyCode, rehypePrettyCodeOptions],
      rehypeKatex,
      rehypeHighlight
    ],
  },
  prepare: (collections) => {
    const { postMetadata, enPostMetadata } = collections;
    const allTagsFromPosts = new Set<string>(postMetadata.flatMap((post) => post.tags));
    const tagsData = Array.from(allTagsFromPosts).map((tag) => {
      return {
        name: tag,
        slug: slugify(tag),
        count: postMetadata.filter((post) => post.tags.includes(tag)).length,
        url: `/posts/tag/${slugify(tag)}`,
      };
    });
    collections.postTags = [
      {
        name: 'All',
        slug: 'all',
        count: postMetadata.length,
        url: '/posts/all',
      },
      ...tagsData,
    ];

    const allTagsFromEnPosts = new Set<string>(enPostMetadata.flatMap((post) => post.tags));
    const enTagsData = Array.from(allTagsFromEnPosts).map((tag) => {
      return {
        name: tag,
        slug: slugify(tag),
        count: enPostMetadata.filter((post) => post.tags.includes(tag)).length,
        url: `/en/posts/tag/${slugify(tag)}`,
      };
    });
    collections.enPostTags = [
      {
        name: 'All',
        slug: 'all',
        count: enPostMetadata.length,
        url: '/en/posts/all',
      },
      ...enTagsData,
    ];
  },
  // after the output assets are generated
  // upload the thumbnail to cloudinary
  complete: async ({ posts: postsData, postMetadata, translations, translationsMetadata, enPosts, enPostMetadata }) => {
    generateRssFeed();
    const { updatedData: updatedPosts, updatedMeta: updatedPostMetadata } = await completeThumbnail(postsData, postMetadata);
    const { updatedData: updatedEnPosts, updatedMeta: updatedEnPostMetadata } = await completeThumbnail(enPosts, enPostMetadata);
    const { updatedData: updatedTranslations, updatedMeta: updatedTranslationsMetadata } = await completeThumbnail(translations, translationsMetadata);

    fs.writeFileSync('.velite/posts.json', JSON.stringify(updatedPosts, null, 2));
    fs.writeFileSync('.velite/postMetadata.json', JSON.stringify(updatedPostMetadata, null, 2));

    fs.writeFileSync('.velite/enPosts.json', JSON.stringify(updatedEnPosts, null, 2));
    fs.writeFileSync('.velite/enPostMetadata.json', JSON.stringify(updatedEnPostMetadata, null, 2));

    fs.writeFileSync('.velite/translations.json', JSON.stringify(updatedTranslations, null, 2));
    fs.writeFileSync('.velite/translationsMetadata.json', JSON.stringify(updatedTranslationsMetadata, null, 2));
  },

});

type Data = z.infer<typeof metadataObject>;

async function completeThumbnail<T extends Data, TMeta extends Data>(data: T[], meta: TMeta[]) {
  const thumbnailMap = new Map<string, ThumbnailType>();

  const updatedData = await Promise.all(data.map(async (item) => {
    if (!item.thumbnail) return item;
    try {
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
      }

      if (item.thumbnail.local.startsWith('/')) {
        const results = await uploadThumbnail(item.thumbnail.local);
        item.thumbnail.cloud = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_300,f_auto/${results.public_id}`;
        item.thumbnail.blurURL = await getBase64ImageUrl(item.thumbnail.cloud);
        thumbnailMap.set(item.slug, item.thumbnail);
      }
      else {
        item.thumbnail.cloud = item.thumbnail.local;
        thumbnailMap.set(item.slug, item.thumbnail);
      }
    }
    catch (e) {
      console.error(e);
    }
    return item;
  }));

  const updatedMeta = meta.map((item) => {
    const thumbnail = thumbnailMap.get(item.slug);
    if (!thumbnail) return item;
    return { ...item, thumbnail };
  });

  return { updatedData, updatedMeta };
}
