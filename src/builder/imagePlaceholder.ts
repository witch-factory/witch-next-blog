import fs from 'node:fs/promises';

import sharp from 'sharp';

export async function createBlurPlaceholder(imagePath: string) {
  try {
    let buffer: Buffer;

    // URL인 경우 fetch, 로컬 파일 경로인 경우 fs.readFile
    if (imagePath.startsWith('http')) {
      buffer = await fetch(imagePath).then(async (res) => {
        return Buffer.from(await res.arrayBuffer());
      });
    }
    else {
      // 로컬 파일 시스템에서 직접 읽기
      buffer = await fs.readFile(imagePath);
    }

    const img = sharp(buffer);
    const { width, height } = await img.metadata();

    if (width == null || height == null) {
      return;
    }

    const aspectRatio = width / height;
    const blurWidth = 8;
    const blurHeight = Math.round(blurWidth / aspectRatio);
    const blurImage = await img
      .resize(blurWidth, blurHeight)
      .webp({ quality: 1 })
      .toBuffer();
    const blurURL = `data:image/webp;base64,${blurImage.toString('base64')}`;
    return blurURL;
  }
  catch (err) {
    console.error('Error generating placeholder:', err);
    return undefined;
  }
}
