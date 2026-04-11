import fs from 'node:fs';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { v2 as cloudinary } from 'cloudinary';

function loadProjectEnv() {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const envFiles = [
    `.env.${nodeEnv}.local`,
    nodeEnv === 'test' ? null : '.env.local',
    `.env.${nodeEnv}`,
    '.env',
  ].filter(Boolean);

  for (const fileName of envFiles) {
    const filePath = path.join(process.cwd(), fileName);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    process.loadEnvFile(filePath);
  }
}

loadProjectEnv();

const generatedDirectory = new URL('../../.content-collections/generated/', import.meta.url);
const generatedPackageJsonPath = new URL('./package.json', generatedDirectory);

if (!fs.existsSync(generatedPackageJsonPath)) {
  writeFileSync(generatedPackageJsonPath, JSON.stringify({ type: 'module' }, null, 2));
}

const {
  allEnPosts,
  allPosts,
  allTranslations,
} = await import('../../.content-collections/generated/index.js');

function createUploadTargets() {
  const thumbnails = [...allPosts, ...allEnPosts, ...allTranslations]
    .map((post) => post.thumbnail?.local)
    .filter((thumbnail) => typeof thumbnail === 'string' && thumbnail.startsWith('/'));

  return [...new Set(thumbnails)];
}

async function uploadThumbnails() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.log('Skipping thumbnail upload: Cloudinary credentials are missing.');
    return;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const uploadTargets = createUploadTargets()
    .filter((thumbnailPath) => fs.existsSync(path.join(process.cwd(), 'public', thumbnailPath)));

  const results = await Promise.allSettled(uploadTargets.map((thumbnailPath) => {
    return cloudinary.uploader.upload(path.join(process.cwd(), 'public', thumbnailPath), {
      public_id: thumbnailPath.replace(/^\/+/, '').replaceAll('/', '-').replaceAll('.', '-'),
      folder: 'blog/thumbnails',
      overwrite: false,
    });
  }));

  const failed = results.filter((result) => result.status === 'rejected');

  if (failed.length > 0) {
    console.log(`Thumbnail upload completed with ${failed.length} failure(s).`);
    for (const failure of failed) {
      console.error(failure.reason);
    }
    return;
  }

  console.log(`Uploaded ${uploadTargets.length} thumbnail(s) to Cloudinary.`);
}

await uploadThumbnails();
