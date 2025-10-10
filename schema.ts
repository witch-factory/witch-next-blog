import fs from 'node:fs';
import path, { basename } from 'node:path';

import { s, defineSchema, z, isRelativePath, ZodMeta } from 'velite';

import { createBlurPlaceholder } from '@/builder/imagePlaceholder';
import { generateHeadingTree } from '@/builder/markdown/headingTree';
import { extractFirstImageUrl } from '@/builder/markdown/parser';
import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
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

type ArticleType = Locale | 'translation';

export const headingTree = defineSchema(() =>
  s.custom().transform<TocEntry[]>((data, { meta }) => {
    if (!meta.mdast) return [];
    return generateHeadingTree(meta.mdast);
  }));

const createUrlTransform = <T extends BaseMarkdownSchemaType>(type: ArticleType) => {
  return (data: T) => {
    let url = '';
    switch (type) {
      case 'ko':
      case 'en':
        url = `/posts/${data.slug}`;
        break;
      case 'translation':
        url = `/translations/${data.slug}`;
        break;
    }
    return { ...data, url };
  };
};

// 썸네일 transform 생성 헬퍼 함수
const createThumbnailTransform = <T extends BaseMarkdownSchemaType>(type: ArticleType) => {
  return async (data: T, { meta }: { meta: ZodMeta }) => {
    const result: ThumbnailType = { local: '', cloud: '' };
    if (!meta.mdast) return { ...data, thumbnail: result };

    const thumbnailUrl = extractFirstImageUrl(meta.mdast);
    const processedTitle = type === 'translation' ? `[번역] ${data.title}` : data.title;

    if (!thumbnailUrl) {
      // vercel og 이미지 생성 fallback
      let ogUrl = '';
      switch (type) {
        case 'ko':
          ogUrl = `${blogLocalConfig.ko.url}/api/og?title=${encodeURIComponent(processedTitle)}`;
          break;
        case 'en':
          ogUrl = `${blogLocalConfig.en.url}/api/og?title=${encodeURIComponent(processedTitle)}`;
          break;
        case 'translation':
          ogUrl = `${blogLocalConfig.ko.url}/api/og?title=${encodeURIComponent(processedTitle)}`;
          break;
      }
      result.local = ogUrl;
      result.cloud = ogUrl;
    }
    // 이미지 경로가 상대 경로가 아니라면 그대로 반환
    else if (!isRelativePath(thumbnailUrl)) {
      result.local = thumbnailUrl;
    }
    else {
      // 상대 경로 처리
      const thumbnailPath = thumbnailUrl.replace('./', '');

      // 원본 content 폴더의 이미지 경로 (blur placeholder 생성용)
      const contentDir = path.dirname(meta.path);
      const originalImagePath = path.join(contentDir, thumbnailPath);

      // blur placeholder 생성 (원본 파일 사용)
      if (fs.existsSync(originalImagePath)) {
        result.blurURL = await createBlurPlaceholder(originalImagePath);
      }

      // velite 처리된 경로는 local에 저장
      const processedThumbnailPath = `${meta.config.output.base}${thumbnailPath}`;
      result.local = processedThumbnailPath;
    }

    // 썸네일을 클라우드에 업로드. vercel og를 통해 생성된 이미지가 아닐 경우에만.
    if (blogConfig.imageStorage === 'cloud' && !result.local.startsWith('https://')) {
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
  .transform(createUrlTransform('ko'))
  .transform(createThumbnailTransform('ko'));

// 영어 게시글 기본 객체 스키마
export const enArticleMetadataSchema = articleMetadataSchema
  .transform(createUrlTransform('en'))
  .transform(createThumbnailTransform('en'));

// 번역 게시글 기본 객체 스키마
export const translationMetadataSchema = metadataSchema
  .transform(createUrlTransform('translation'))
  .transform(createThumbnailTransform('translation'));

// 한국어 게시글 스키마
export const koArticleSchema = articleMetadataSchema.extend({
  html: s.markdown({ gfm: true }),
  headingTree: headingTree(),
})
  .transform(createUrlTransform('ko'))
  .transform(createThumbnailTransform('ko'));

// 영어 게시글 스키마
export const enArticleSchema = articleMetadataSchema.extend({
  html: s.markdown({ gfm: true, remarkPlugins: [remarkImagePath] }),
  headingTree: headingTree(),
})
  .transform(createUrlTransform('en'))
  .transform(createThumbnailTransform('en'));

// 번역 게시글 스키마
export const translationSchema = metadataSchema.extend({
  html: s.markdown({ gfm: true }),
  headingTree: headingTree(),
})
  .transform(createUrlTransform('translation'))
  .transform(createThumbnailTransform('translation'));
