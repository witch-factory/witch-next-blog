import { basename } from 'node:path';

import { s, defineSchema } from 'velite';

import { generateHeadingTree } from '@/builder/markdown/headingTree';
import { generateThumbnailURL } from '@/builder/markdown/thumbnail';
import remarkImagePath from '@/plugins/remark-image-path';
import { ThumbnailType, TocEntry } from '@/types/components';

export const headingTree = defineSchema(() =>
  s.custom().transform<TocEntry[]>((data, { meta }) => {
    if (!meta.mdast) return [];
    return generateHeadingTree(meta.mdast);
  }));

export const metadataObject = s.object({
  slug: s.path().transform<string>((data) => basename(data)),
  title: s.string().max(99),
  date: s.string().datetime(),
  description: s.string().max(200),
  thumbnail: s.object({
    local: s.string(),
    cloud: s.string().optional(),
    blurURL: s.string().optional(),
  }).optional(),
});

export const articleMetadataObject = metadataObject.extend({
  tags: s.array(s.string()),
});

export const articleMetadataSchema = defineSchema(() =>
  articleMetadataObject
    // transform을 거친 타입은 동기 함수일 경우 타입에 포함됨
    .transform((data) => ({ ...data, url: `/posts/${data.slug}` })),
);

export const articleSchema = defineSchema(() =>
  articleMetadataObject
    .extend({
      html: s.markdown({
        gfm: true,
      }),
      headingTree: headingTree(),
    })
    .transform((data) => ({ ...data, url: `/posts/${data.slug}` }))
    .transform(async (data, { meta }) => {
      if (!meta.mdast) return data;
      const localThumbnailURL = await generateThumbnailURL(meta, data.title, 'ko');
      const thumbnail: ThumbnailType = {
        local: localThumbnailURL,
      };
      return ({ ...data, thumbnail });
    }),
);

export const enArticleMetadataSchema = defineSchema(() =>
  articleMetadataObject
    // transform을 거친 타입은 동기 함수일 경우 타입에 포함됨
    .transform((data) => ({ ...data, url: `/posts/${data.slug}` })),
);

export const enArticleSchema = defineSchema(() =>
  articleMetadataObject
    .extend({
      html: s.markdown({
        gfm: true,
        remarkPlugins: [remarkImagePath],
      }),
      headingTree: headingTree(),
    })
    .transform((data) => ({ ...data, url: `/posts/${data.slug}` }))
    .transform(async (data, { meta }) => {
      if (!meta.mdast) return data;
      const localThumbnailURL = await generateThumbnailURL(meta, data.title, 'en');
      const thumbnail: ThumbnailType = {
        local: localThumbnailURL,
      };
      return ({ ...data, thumbnail });
    }),
);

export const translationMetadataSchema = defineSchema(() =>
  metadataObject
    .transform((data) => ({ ...data, url: `/translations/${data.slug}` })),
);

export const translationSchema = defineSchema(() =>
  metadataObject
    .extend({
      html: s.markdown({
        gfm: true,
      }),
      headingTree: headingTree(),
    })
    .transform((data) => ({ ...data, url: `/translations/${data.slug}` }))
    .transform(async (data, { meta }) => {
      if (!meta.mdast) return data;
      const localThumbnailURL = await generateThumbnailURL(meta, `[번역] ${data.title}`);
      const thumbnail: ThumbnailType = {
        local: localThumbnailURL,
      };
      return ({ ...data, thumbnail });
    }),
);
