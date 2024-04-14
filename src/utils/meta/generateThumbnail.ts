import fs from 'fs/promises';
import path, { join } from 'path';

import { createCanvas, GlobalFonts, SKRSContext2D, Image } from '@napi-rs/canvas';
import { Root as Mdast } from 'mdast';
import { visit } from 'unist-util-visit';
import { isRelativePath, processAsset, ZodMeta } from 'velite';

import { TocEntry } from '@/types/components';

const __dirname = path.resolve();
GlobalFonts.registerFromPath(join(__dirname, 'fonts', 'NotoSansKR-Bold-Hestia.woff'), 'NotoSansKR');

// 모든 이미지 뽑아내기
function extractImgSrc(tree: Mdast) {
  const images: string[] = [];
  visit(tree, 'image', (node)=>{
    images.push(node.url);
  });
  return images;
}

// max width를 넘어가는 문자열마다 줄바꿈 삽입
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

function drawHeadings(ctx: SKRSContext2D, title: string, headingTree: TocEntry[]) {
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

async function createThumbnail(title: string, headingTree: TocEntry[], filePath: string) {
  const width = 400;
  const height = 300;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 캔버스 초기화
  initCanvas(ctx, width, height);

  // 각 섹션 그리기
  drawTitle(ctx, title);
  drawHeadings(ctx, title, headingTree);

  // 블로그 심볼 그리기
  await drawBlogSymbol(ctx, 'Witch-Work');

  const pngData = await canvas.encode('png');
  const fileName = getThumbnailFileName(filePath);
  await fs.writeFile(getThumbnailPath(fileName), pngData);

  return getPublicThumbnailURL(fileName);
}

// 상대 경로 이미지 처리 및 적합한 URL 반환
async function processImageForThumbnail(imageURL: string, meta: ZodMeta) {
  const processedImage = await processAsset(imageURL, meta.path, meta.config.output.name, meta.config.output.base, true);
  return processedImage.src;
}

export async function generateThumbnailURL(meta: ZodMeta, title: string, headingTree: TocEntry[], filePath: string) {
  // source of the images
  if (!meta.mdast) return '/witch-new-hat.png'; 
  const images = extractImgSrc(meta.mdast);
  if (images.length > 0) {
    const imageURL = images[0];

    // 상대 경로 이미지인 경우 processAsset 함수로 처리
    return isRelativePath(imageURL) ?
      processImageForThumbnail(imageURL, meta) :
      imageURL;
  }
  else {
    // 썸네일 직접 만들기
    return createThumbnail(title, headingTree, filePath);
  }
}

// 헬퍼 함수들
function getThumbnailFileName(filePath: string) {
  return `${filePath.replaceAll('/', '-').replaceAll('.', '-')}-index-md-thumbnail.png`;
}

function getThumbnailPath(fileName: string) {
  return join(__dirname, 'public', 'thumbnails', fileName);
}

function getPublicThumbnailURL(fileName: string) {
  return `/thumbnails/${fileName}`;
}