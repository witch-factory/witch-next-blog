import fs from 'node:fs';
import path, { basename } from 'node:path';

import { s, defineSchema, z, isRelativePath, ZodMeta } from 'velite';

import { createBlurPlaceholder } from '@/builder/imagePlaceholder';
import { generateHeadingTree } from '@/builder/markdown/headingTree';
import { extractFirstImageUrl } from '@/builder/markdown/parser';
import { blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/constants/i18n';
import remarkImagePath from '@/plugins/remark-image-path';
import { ThumbnailType, TocEntry } from '@/types/components';

export const baseMarkdownSchema = s.object({
  slug: s.path().transform<string>((data) => basename(data)),
  title: s.string().max(99),
  date: s.string().datetime(),
  description: s.string().max(200),
});

type BaseMarkdownSchemaType = z.infer<typeof baseMarkdownSchema>;

export const headingTree = defineSchema(() =>
  s.custom().transform<TocEntry[]>((data, { meta }) => {
    if (!meta.mdast) return [];
    return generateHeadingTree(meta.mdast);
  }));

const createUrlTransform = <T extends BaseMarkdownSchemaType>(locale: Locale, isTranslation = false) => {
  return (data: T) => ({
    ...data,
    url: isTranslation ? `/translations/${data.slug}` : `/posts/${data.slug}`,
  });
};

// 썸네일 transform 생성 헬퍼 함수
const createThumbnailTransform = <T extends BaseMarkdownSchemaType>(locale: Locale, isTranslation = false) => {
  return async (data: T, { meta }: { meta: ZodMeta }) => {
    const result: ThumbnailType = { local: '', cloud: '' };
    if (!meta.mdast) return { ...data, thumbnail: result };

    const thumbnailUrl = extractFirstImageUrl(meta.mdast);
    const processedTitle = isTranslation ? `[번역] ${data.title}` : data.title;

    if (!thumbnailUrl) {
      // vercel og 이미지 생성 fallback
      const ogUrl = `${blogLocalConfig[locale].url}/api/og?title=${encodeURIComponent(processedTitle)}`;
      result.local = ogUrl;
      result.cloud = ogUrl;
    }
    // 이미지 경로가 상대 경로가 아니라면 그대로 반환
    else if (!isRelativePath(thumbnailUrl)) {
      result.local = thumbnailUrl;
    }
    else {
      // 상대 경로를 절대 경로로 변환
      const thumbnailPath = thumbnailUrl.replace('./', '');
      const processedThumbnailPath = `${meta.config.output.base}${thumbnailPath}`;
      result.local = processedThumbnailPath;
      // 로컬에 이미 이미지가 있을 경우 blurPlaceholder 생성
      const localPath = path.join(meta.config.output.base, thumbnailPath);
      if (fs.existsSync(localPath)) {
        result.blurURL = await createBlurPlaceholder(localPath);
      }
    }

    // 썸네일을 클라우드에 업로드. vercel og를 통해 생성된 이미지가 아닐 경우에만.
    if (blogLocalConfig[locale].imageStorage === 'cloud' && !result.local.startsWith('https://')) {
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
      }

      // https://res.cloudinary.com/desigzbvj/image/upload/c_scale,w_300,f_auto/blog/thumbnails/static-search-start-78fd3a72-png
      const processedLocal = result.local.replace(/^\/+/, '').replaceAll('/', '-').replaceAll('.', '-');

      const completeCloudImagePath = `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_300,f_auto/blog/thumbnails/${processedLocal}`;
      result.cloud = `https://res.cloudinary.com/${completeCloudImagePath}`;
    }

    return { ...data, thumbnail: result };
  };
};

export const metadataSchema = baseMarkdownSchema.extend({
  thumbnail: s.object({
    local: s.string(),
    cloud: s.string(),
    blurURL: s.string().optional(),
  }).optional(),
});

const articleMetadataSchema = metadataSchema.extend({
  tags: s.array(s.string()),
});

// 한국어 게시글 기본 객체 스키마
export const koArticleMetadataSchema = articleMetadataSchema
  .transform(createUrlTransform('ko', false))
  .transform(createThumbnailTransform('ko', false));

// 영어 게시글 기본 객체 스키마
export const enArticleMetadataSchema = articleMetadataSchema
  .transform(createUrlTransform('en', false))
  .transform(createThumbnailTransform('en', false));

// 번역 게시글 기본 객체 스키마
export const translationMetadataSchema = metadataSchema
  .transform(createUrlTransform('ko', true))
  .transform(createThumbnailTransform('ko', true));

// 한국어 게시글 스키마
export const koArticleSchema = articleMetadataSchema.extend({
  html: s.markdown({ gfm: true }),
  headingTree: headingTree(),
})
  .transform(createUrlTransform('ko', false))
  .transform(createThumbnailTransform('ko', false));

// 영어 게시글 스키마
export const enArticleSchema = articleMetadataSchema.extend({
  html: s.markdown({ gfm: true, remarkPlugins: [remarkImagePath] }),
  headingTree: headingTree(),
})
  .transform(createUrlTransform('en', false))
  .transform(createThumbnailTransform('en', false));

// 번역 게시글 스키마
export const translationSchema = metadataSchema.extend({
  html: s.markdown({ gfm: true }),
  headingTree: headingTree(),
})
  .transform(createUrlTransform('ko', true))
  .transform(createThumbnailTransform('ko', true));
