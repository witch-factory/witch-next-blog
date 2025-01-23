import path from 'node:path';

import { Root as Mdast } from 'mdast';
import { visit } from 'unist-util-visit';
import { isRelativePath, processAsset, ZodMeta } from 'velite';

import { blogConfig } from '@/config/blogConfig';
import { Locale } from '@/types/i18n';

// 모든 이미지 뽑아내기
function extractImgSrc(tree: Mdast) {
  const images: string[] = [];
  visit(tree, 'image', (node) => {
    images.push(node.url);
  });
  return images;
}

// 상대 경로 이미지 처리 및 적합한 URL 반환
async function processImageForThumbnail(imageURL: string, meta: ZodMeta) {
  const processedImage = await processAsset(imageURL, meta.path, meta.config.output.name, meta.config.output.base, true);
  return processedImage.src;
}

// 언어별 이미지 경로 업데이트
function updateImagePathForLanguage(imageURL: string, meta: ZodMeta, lang: Locale): string {
  if (lang === 'ko') return imageURL;

  const articleSlugPath = path.basename(path.dirname(meta.path));
  const updatedDir = `../../posts`;
  const fileName = imageURL.replace('./', '');

  return `${updatedDir}/${articleSlugPath}/${fileName}`;
}

export async function generateThumbnailURL(meta: ZodMeta, title: string, lang: Locale = 'ko') {
  // source of the images
  if (!meta.mdast) return '/witch-new-hat.png';
  const images = extractImgSrc(meta.mdast);
  if (images.length > 0) {
    const imageURL = updateImagePathForLanguage(images[0], meta, lang);

    // console.log('이미지 경로 ', imageURL);
    // 상대 경로 이미지인 경우 processAsset 함수로 처리
    return isRelativePath(imageURL)
      ? processImageForThumbnail(imageURL, meta)
      : imageURL;
  }
  else {
    // vercel/og를 이용한 open graph 이미지 생성
    return `${blogConfig[lang].url}/api/og?title=${encodeURIComponent(title)}`;
  }
}
