import fs from 'node:fs';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { Feed } from 'feed';
import { v2 as cloudinary } from 'cloudinary';

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

const baseUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://witch.work';

const blogLocalConfig = {
  ko: {
    title: 'Witch-Work, 마녀 작업실',
    description: '"마녀"라는 닉네임을 쓰는 개발자입니다. 제가 보았던 가장 멋진 사람들을 따라 개발을 시작했고, 그들과 함께 걷다 보니 어느새 여기까지 왔습니다. 이곳에 찾아오신 당신과도 함께할 수 있어 영광입니다.',
    url: `${baseUrl}/ko`,
  },
  en: {
    title: 'Witch-Work, The Witchcraft',
    description: 'I\'m a frontend developer using a nickname "Witch". I became who I am by following the coolest people I\'ve ever met. It\'s also an honor to now share a few steps with you',
    url: `${baseUrl}/en`,
  },
};

function sortByDate(items) {
  return [...items].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

function generateRssFeed() {
  const feed = new Feed({
    id: blogLocalConfig.ko.url,
    title: blogLocalConfig.ko.title,
    description: blogLocalConfig.ko.description,
    link: blogLocalConfig.ko.url,
    feedLinks: {
      rss2: `${blogLocalConfig.ko.url}/feed.xml`,
      json: `${blogLocalConfig.ko.url}/feed.json`,
      atom: `${blogLocalConfig.ko.url}/atom.xml`,
    },
    updated: new Date(),
    copyright: '',
  });

  const localizedPosts = [
    ['ko', sortByDate(allPosts)],
    ['en', sortByDate(allEnPosts)],
  ];

  for (const [lang, posts] of localizedPosts) {
    for (const post of posts) {
      feed.addItem({
        title: post.title,
        description: post.description,
        link: `${blogLocalConfig[lang].url}${post.url}`,
        date: new Date(post.date),
      });
    }
  }

  writeFileSync('./public/feed.xml', feed.rss2(), { encoding: 'utf-8' });
  writeFileSync('./public/atom.xml', feed.atom1(), { encoding: 'utf-8' });
  writeFileSync('./public/feed.json', feed.json1(), { encoding: 'utf-8' });
  console.log('Generated public/feed.xml, atom.xml, and feed.json');
}

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

generateRssFeed();
await uploadThumbnails();
