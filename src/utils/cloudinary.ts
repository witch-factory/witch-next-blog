import path, { join } from 'path';

import { v2 as cloudinary } from 'cloudinary';

const __dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function removeLeadingSlash(str: string) {
  // 문자열의 시작 부분에 있는 하나 이상의 슬래시(/)를 제거합니다.
  // ^\/+는 문자열의 시작 부분에 있는 하나 이상의 슬래시를 의미합니다.
  return str.replace(/^\/+/, '');
}

function generatePublicId(filePath: string) {
  return removeLeadingSlash(filePath).replaceAll('/', '-').replaceAll('.', '-');
}

// thumbnail.local을 받는다
export function uploadThumbnail(filePath: string) {
  return cloudinary.uploader.upload(join(__dirname, 'public', filePath), {
    public_id: generatePublicId(filePath),
    folder: 'blog/thumbnails',
    overwrite: false,
  });
}
