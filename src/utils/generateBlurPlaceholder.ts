import sharp from 'sharp';

export async function getBase64ImageUrl(imageUrl: string) {
  try {
    const buffer = await fetch(imageUrl).then(async (res) => {
      return Buffer.from(await res.arrayBuffer());
    });
    const img = sharp(buffer);
    const { width, height } = await img.metadata();
    if (width == null || height == null) return;
    const aspectRatio = width / height;
    const blurWidth = 8;
    const blurHeight = Math.round(blurWidth / aspectRatio);
    const blurImage = await img
      .resize(blurWidth, blurHeight)
      .webp({ quality: 1 })
      .toBuffer();
    const blurURL = `data:image/webp;base64,${blurImage.toString('base64')}`;
    return blurURL;
  } catch (err) {
    console.error(err);
    return '';
  }
}
