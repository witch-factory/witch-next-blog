import path from 'node:path';

import { isRelativePath, processAsset, ZodMeta } from 'velite';

import { blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/constants/i18n';

import { extractFirstImageUrl } from './parser';

// 언어별 이미지 경로 업데이트
function getLocalizedImagePath(imageUrl: string, meta: ZodMeta, lang: Locale): string {
  if (lang === 'ko') return imageUrl;

  const slug = path.basename(path.dirname(meta.path));
  const baseDir = `../../posts`;
  const fileName = imageUrl.replace('./', '');

  return `${baseDir}/${slug}/${fileName}`;
}

async function resolveImageAssetPath(imageUrl: string, meta: ZodMeta): Promise<string> {
  if (!isRelativePath(imageUrl)) return imageUrl;

  const asset = await processAsset(
    imageUrl,
    meta.path,
    meta.config.output.name,
    meta.config.output.base,
    true,
  );
  return asset.src;
}

export async function generateThumbnailURL(meta: ZodMeta, title: string, lang: Locale = 'ko') {
  if (!meta.mdast) {
    return '/witch-new-hat.png';
  }

  const thumbnailUrl = extractFirstImageUrl(meta.mdast);
  if (!thumbnailUrl) {
    // vercel og 이미지 생성 fallback
    const ogUrl = `${blogLocalConfig[lang].url}/api/og?title=${encodeURIComponent(title)}`;
    return ogUrl;
  }

  const localizedPath = getLocalizedImagePath(thumbnailUrl, meta, lang);
  return resolveImageAssetPath(localizedPath, meta);
}
