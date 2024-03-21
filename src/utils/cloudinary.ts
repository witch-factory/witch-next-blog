import path, { join } from 'path';

import { v2 as cloudinary } from 'cloudinary';

const __dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// thumbnail.local을 받는다
export function uploadThumbnail(filePath: string) {
  return cloudinary.uploader.upload(join(__dirname, 'public', filePath), {
    public_id: filePath.replaceAll('/', '-').replaceAll('.','-'),
    folder: 'blog/thumbnails',
    overwrite: false,
  });
}
