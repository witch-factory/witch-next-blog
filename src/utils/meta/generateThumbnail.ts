import { Root as Mdast } from 'mdast';
import { visit } from 'unist-util-visit';
import { isRelativePath, processAsset, ZodMeta } from 'velite';

import { blogConfig } from '@/config/blogConfig';

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

export async function generateThumbnailURL(meta: ZodMeta, title: string) {
  // source of the images
  if (!meta.mdast) return '/witch-new-hat.png';
  const images = extractImgSrc(meta.mdast);
  if (images.length > 0) {
    const imageURL = images[0];

    // 상대 경로 이미지인 경우 processAsset 함수로 처리
    return isRelativePath(imageURL)
      ? processImageForThumbnail(imageURL, meta)
      : imageURL;
  }
  else {
    // vercel/og를 이용한 open graph 이미지 생성
    return `${blogConfig.url}/api/og?title=${title}`;
  }
}
