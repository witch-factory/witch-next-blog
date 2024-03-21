import fs from 'fs/promises';
import path, { join } from 'path';

import { createCanvas, GlobalFonts, SKRSContext2D, Image } from '@napi-rs/canvas';
import { visit } from 'unist-util-visit';
import { Node } from 'unist-util-visit/lib';
import { isRelativePath, processAsset, VeliteMeta } from 'velite';


const __dirname = path.resolve();
GlobalFonts.registerFromPath(join(__dirname, 'fonts', 'NotoSansKR-Bold-Hestia.woff'), 'NotoSansKR');

type ImageNode=Node & {url: string};

// 모든 이미지 뽑아내기
function extractImgSrc(tree: Node) {
  const images: string[] = [];
  // console.log(tree);
  visit(tree, 'image', (node: ImageNode)=>{
    images.push(node.url);
  });
  return images;
}

// max width에 맞게 문자열 자르고 줄바꿈하기
const stringWrap = (s: string, maxWidth: number) => s.replace(
  new RegExp(`(?![^\\n]{1,${maxWidth}}$)([^\\n]{1,${maxWidth}})\\s`, 'g'), '$1\n'
);


function initCanvas(ctx: SKRSContext2D, width: number, height: number) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000';
}

function drawTitle(ctx: SKRSContext2D, title: string) {
  title = stringWrap(title, 15);
  const titleByLine = title.split('\n');
  ctx.font = '40px NotoSansKR';
  for (let i = 0; i < titleByLine.length; i++) {
    ctx.fillText(titleByLine[i], 20, 50 + 50 * i);
  }
}

type HeadingType = {
  title: string;
  url: string;
  items: HeadingType[];
};


function drawHeadings(ctx: SKRSContext2D, title: string, headingTree: HeadingType[]) {
  title = stringWrap(title, 15);
  const titleByLine = title.split('\n');
  if (titleByLine.length > 3) {return;}

  // h1의 앞쪽 2개만 추출
  const thumbnailHeadings = headingTree.slice(0, 2);
  const headingTexts = [];
  for (let h of thumbnailHeadings) {
    const headingText = h.title.replaceAll('. ', '-');
    headingTexts.push(headingText);
  }
  headingTexts[headingTexts.length - 1] += '...';
  ctx.font = '20px NotoSansKR';
  for (let i = 0; i < headingTexts.length; i++) {
    ctx.fillText(headingTexts[i], 20, 50 + 50 * titleByLine.length + 25 * i);
  }
}


async function drawBlogSymbol(ctx: SKRSContext2D, blogName: string) {
  const hatImage = await fs.readFile(join(__dirname, 'public', 'witch-new-hat-40x40.png'));
  const image = new Image();
  image.src = hatImage;

  image.width = 40;
  image.height = 40;

  ctx.drawImage(image, 20, 240);

  ctx.font = '20px NotoSansKR';
  ctx.fillText(blogName, 60, 270);
}

async function createThumbnailFromText(title: string, headingTree: HeadingType[], filePath: string) {
  const width = 400;
  const height = 300;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  initCanvas(ctx, width, height);

  drawTitle(ctx, title);
  drawHeadings(ctx, title, headingTree);

  await drawBlogSymbol(ctx, 'Witch-Work');

  const fileName = `${filePath.replaceAll('/', '-').replaceAll('.','-')}-index-md-thumbnail.png`;

  const pngData = await canvas.encode('png');
  await fs.writeFile(join(__dirname, 'public', 'thumbnails', fileName), pngData);
  const resultPath = `/thumbnails/${fileName}`;

  return resultPath;
}


type thumbnailData = {
  local: string;
  cloudinary?: string;
  blurURL?: string;
};


async function makeThumbnailFromMeta(meta: VeliteMeta, title: string, headingTree: HeadingType[], filePath: string) {
  // source of the images
  const images = extractImgSrc(meta.mdast as Node);
  if (images.length > 0) {
    // 이미지가 있으면 그걸로 썸네일 만들기
    if (!isRelativePath(images[0])) {
      return images[0];
    }
    else {
      // 이미지가 상대 경로로 들어가 있다
      const localImage = await processAsset(images[0], meta.path, meta.config.output.name, meta.config.output.base, true);
      return localImage.src;
    }
  }
  else {
    // 썸네일 직접 만들기
    const b = await createThumbnailFromText(title, headingTree, filePath);
    return b;
  }
}

// filePath는 썸네일 생성하는 경우에 새로 생성할 파일의 경로
export async function makeThumbnail(meta: VeliteMeta, title: string, headingTree: HeadingType[], filePath: string): Promise<thumbnailData> {

  const thumbnail: thumbnailData = {
    local: await makeThumbnailFromMeta(meta, title, headingTree, filePath),
  };

  return thumbnail;
}