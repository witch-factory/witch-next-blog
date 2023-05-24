import fs from 'fs';
import path from 'path';

import fsExtra from 'fs-extra';

const fsPromises = fs.promises;
// 이미지를 넣을 디렉토리
const imageDir='./public/images/posts';
// 포스트 디렉토리
const postDir='./posts';

async function copyImage(sourceDir, targetDir, images) {
  for (const image of images) {
    const sourcePath = `${sourceDir}/${image}`;
    const targetPath = `${targetDir}/${image}`;
    await fsPromises.copyFile(sourcePath, targetPath);
  }
}

const imageFileExtensions=['.png', '.jpg', '.jpeg', '.gif'];

async function getInnerDirectories(dir) {
  const files = await fsPromises.readdir(dir, {withFileTypes:true});
  return files.filter(file=>file.isDirectory());
}

async function getInnerImages(dir) {
  const files=await fsPromises.readdir(dir);
  return files.filter((file) => imageFileExtensions.includes(path.extname(file)));
}

async function copyPostDirImages() {
  // posts 폴더 내의 카테고리들. cs, front...
  const postCategories = await getInnerDirectories(postDir);

  for (const _category of postCategories) {
    // 카테고리 내의 포스트 폴더들 읽어오기
    const category=_category.name;
    const posts=await getInnerDirectories(`${postDir}/${category}`);

    for (const _post of posts) {
      const post=_post.name;
      const postImages=await getInnerImages(`${postDir}/${category}/${post}`);

      if (postImages.length) {
        // 폴더 생성
        await fsPromises.mkdir(`${imageDir}/${category}/${post}`, { recursive: true });
        await copyImage(`${postDir}/${category}/${post}`, `${imageDir}/${category}/${post}`, postImages);
      }
    }
  }
}

await fsExtra.emptyDir(imageDir);
await copyPostDirImages();