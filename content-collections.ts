import fs from 'node:fs';

import { Context, defineCollection, defineConfig } from '@content-collections/core';
import { z } from 'zod';

import { compileCustomMarkdown } from '@/builder/compileCustomMarkdown';
import { createBlurPlaceholder } from '@/builder/imagePlaceholder';
import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { ThumbnailType } from '@/types/components';
import {
  DocumentKind,
  getOriginalAssetPath,
  getPublicAssetUrl,
  getSlugFromFilePath,
  isRelativeAssetPath,
} from '@/utils/content/assetPath';

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

function isRelativeImagePath(imageUrl: string) {
  return isRelativeAssetPath(imageUrl);
}

function createOgImageUrl(title: string, kind: DocumentKind) {
  const locale = kind === 'en' ? 'en' : 'ko';
  const processedTitle = kind === 'translation' ? `[번역] ${title}` : title;

  return `${blogLocalConfig[locale].url}/api/og?title=${encodeURIComponent(processedTitle)}`;
}

async function createThumbnail(
  filePath: string,
  title: string,
  firstImageUrl: string | null,
  kind: DocumentKind,
) {
  const result: ThumbnailType = { local: '', cloud: '' };

  if (!firstImageUrl) {
    const ogUrl = createOgImageUrl(title, kind);
    result.local = ogUrl;
    result.cloud = ogUrl;
    return result;
  }

  if (!isRelativeImagePath(firstImageUrl)) {
    result.local = firstImageUrl;
    result.cloud = firstImageUrl;
    return result;
  }

  const originalImagePath = getOriginalAssetPath(filePath, firstImageUrl, kind);

  if (fs.existsSync(originalImagePath)) {
    result.blurURL = await createBlurPlaceholder(originalImagePath);
  }

  result.local = getPublicAssetUrl(filePath, firstImageUrl, kind);

  if (blogConfig.imageStorage === 'cloud' && !result.local.startsWith('https://')) {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
    }

    const processedLocal = result.local.replace(/^\/+/, '').replaceAll('/', '-').replaceAll('.', '-');
    const completeCloudImagePath = `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_300,f_auto/blog/thumbnails/${processedLocal}`;
    result.cloud = `https://res.cloudinary.com/${completeCloudImagePath}`;
  }

  return result;
}

const THUMBNAIL_PIPELINE_VERSION = '2026-07-17-cached-thumbnail-v1';

// 썸네일(blur placeholder 포함)은 sharp 연산이 비싸므로 캐시한다.
// 이미지 파일 자체가 바뀌면 재생성되도록 mtime을 캐시 키에 포함한다.
function createCachedThumbnail(
  { cache }: Pick<Context, 'cache'>,
  filePath: string,
  title: string,
  firstImageUrl: string | null,
  kind: DocumentKind,
) {
  let imageMtime = 0;
  if (firstImageUrl && isRelativeImagePath(firstImageUrl)) {
    const originalImagePath = getOriginalAssetPath(filePath, firstImageUrl, kind);
    imageMtime = fs.statSync(originalImagePath, { throwIfNoEntry: false })?.mtimeMs ?? 0;
  }

  return cache(
    { filePath, title, firstImageUrl, kind, imageMtime, version: THUMBNAIL_PIPELINE_VERSION },
    () => createThumbnail(filePath, title, firstImageUrl, kind),
    { key: '__thumbnail' },
  );
}

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.md',
  schema: basePostSchema.extend({
    tags: z.array(z.string()),
  }),
  transform: async (document, context) => {
    const { html, headingTree, firstImageUrl } = await compileCustomMarkdown(context, document);
    const slug = getSlugFromFilePath(document._meta.filePath);
    const thumbnail = await createCachedThumbnail(context, document._meta.filePath, document.title, firstImageUrl, 'ko');

    return {
      title: document.title,
      date: document.date,
      description: document.description,
      tags: document.tags,
      _meta: document._meta,
      slug,
      url: createUrl(slug, 'ko'),
      html,
      headingTree,
      thumbnail,
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
    const { html, headingTree, firstImageUrl } = await compileCustomMarkdown(context, document, 'en');
    const slug = getSlugFromFilePath(document._meta.filePath);
    const thumbnail = await createCachedThumbnail(context, document._meta.filePath, document.title, firstImageUrl, 'en');
    return {
      title: document.title,
      date: document.date,
      description: document.description,
      tags: document.tags,
      _meta: document._meta,
      slug,
      url: createUrl(slug, 'en'),
      html,
      headingTree,
      thumbnail,
    };
  },
});

const translations = defineCollection({
  name: 'translations',
  directory: 'content/translations',
  include: '**/*.md',
  schema: basePostSchema,
  transform: async (document, context) => {
    const { html, headingTree, firstImageUrl } = await compileCustomMarkdown(context, document, 'translation');
    const slug = getSlugFromFilePath(document._meta.filePath);
    const thumbnail = await createCachedThumbnail(context, document._meta.filePath, document.title, firstImageUrl, 'translation');
    return {
      title: document.title,
      date: document.date,
      description: document.description,
      _meta: document._meta,
      slug,
      url: createUrl(slug, 'translation'),
      html,
      headingTree,
      thumbnail,
    };
  },
});

export default defineConfig({
  content: [posts, enPosts, translations],
});
