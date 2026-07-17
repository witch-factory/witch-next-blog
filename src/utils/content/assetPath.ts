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
  // filePath는 컬렉션 디렉토리 기준 상대경로이므로 CWD 기준으로 resolve하면 안 된다
  const slug = getSlugFromFilePath(filePath);
  const normalizedPath = normalizeRelativeAssetPath(assetPath);

  return path.join(process.cwd(), 'content', getPublicAssetRoot(kind), slug, normalizedPath);
}
