import path from 'node:path';

import { Locale } from '@/constants/i18n';

export type DocumentKind = Locale | 'translation';

export function getSlugFromFilePath(filePath: string) {
  return path.basename(path.dirname(filePath));
}

export function isRelativeAssetPath(assetPath: string) {
  return assetPath.startsWith('./') || assetPath.startsWith('../');
}

export function normalizeRelativeAssetPath(assetPath: string) {
  return assetPath.replace(/^(\.\/)+/, '').replace(/^(\.\.\/)+/, '');
}

function getPublicAssetRoot(kind: DocumentKind) {
  return kind === 'translation' ? 'translations' : 'posts';
}

export function getPublicAssetRelativePath(
  filePath: string,
  assetPath: string,
  kind: DocumentKind,
) {
  const slug = getSlugFromFilePath(filePath);
  const normalizedPath = normalizeRelativeAssetPath(assetPath);

  return path.posix.join(getPublicAssetRoot(kind), slug, normalizedPath);
}

export function getPublicAssetUrl(
  filePath: string,
  assetPath: string,
  kind: DocumentKind,
) {
  return `/${path.posix.join('static', getPublicAssetRelativePath(filePath, assetPath, kind))}`;
}

export function getOriginalAssetPath(
  filePath: string,
  assetPath: string,
  kind: DocumentKind,
) {
  const normalizedPath = normalizeRelativeAssetPath(assetPath);

  if (kind === 'en') {
    const slug = getSlugFromFilePath(filePath);
    return path.join(process.cwd(), 'content', 'posts', slug, normalizedPath);
  }

  return path.resolve(path.dirname(filePath), normalizedPath);
}
