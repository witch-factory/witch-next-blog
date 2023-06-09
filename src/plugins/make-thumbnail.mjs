import fs from 'fs/promises';
import {join} from 'path';
import path from 'path';

import { createCanvas, GlobalFonts, Image } from '@napi-rs/canvas';
import {visit} from 'unist-util-visit';

import cloudinary from '../utils/cloudinary';
import getBase64ImageUrl from '../utils/generateBlurPlaceholder';


const __dirname = path.resolve();
GlobalFonts.registerFromPath(join(__dirname, 'fonts', 'NotoSansKR-Bold-Hestia.woff'), 'NotoSansKR');

// 모든 이미지 뽑아내기
function extractImgSrc(tree) {
  const images=[];
  visit(tree, 'image', (node)=>{
    images.push(node.url);
  });
  return images;
}

const stringWrap = (s, maxWidth) => s.replace(
  new RegExp(`(?![^\\n]{1,${maxWidth}}$)([^\\n]{1,${maxWidth}})\\s`, 'g'), '$1\n'
);

function initCanvas(ctx, width, height) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000';
}

function drawTitle(ctx, title) {
  title=stringWrap(title, 15);
  title=title.split('\n');
  ctx.font = '40px NotoSansKR';
  for (let i=0; i<title.length; i++) {
    ctx.fillText(title[i], 20, 50+50*i);
  }
}

function drawHeadings(ctx, title, headingTree) {
  title=stringWrap(title, 15);
  title=title.split('\n');
  
  if (title.length>3) {return;}

  const thumbnailHeadings=headingTree.slice(0, 2);
  const headingTexts=[];
  for (let h of thumbnailHeadings) {
    const headingText=h.data.hProperties.title.replaceAll('. ', '-');
    headingTexts.push(headingText);
  }
  headingTexts[headingTexts.length-1]+='...';
  ctx.font = '20px NotoSansKR';
  for (let i=0; i<headingTexts.length; i++) {
    ctx.fillText(headingTexts[i], 20, 50+50*title.length+25*i);
  }
}

async function drawBlogSymbol(ctx, blogName) {
  const hatImage = await fs.readFile(join(__dirname, 'public', 'witch-hat.svg'));
  const image=new Image();
  image.src=hatImage;

  image.width=40;
  image.height=40;

  ctx.drawImage(image, 20, 240);

  ctx.font = '20px NotoSansKR';
  ctx.fillText(blogName, 60, 270);
}

async function createThumbnailFromText(title, headings, filePath) {
  const width=400;
  const height=300;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  initCanvas(ctx, width, height);

  drawTitle(ctx, title);

  drawHeadings(ctx, title, headings);

  await drawBlogSymbol(ctx, 'Witch-Work');

  const fileName=`${filePath.replaceAll('/', '-').replaceAll('.','-')}-thumbnail.png`;

  const pngData=await canvas.encode('png');
  await fs.writeFile(join(__dirname, 'public', 'thumbnails', fileName), pngData);
  const resultPath=`/thumbnails/${fileName}`;

  return resultPath;
}

export default function makeThumbnail() {
  return async function(tree, file) {
    const images=extractImgSrc(tree);
    if (images.length>0) {
      file.data.rawDocumentData.thumbnail={
        local: images[0],
      };
    }
    else {
      const title=file.value.split('\n')[1].replace('title: ', '');
      const {headingTree, sourceFilePath}=file.data.rawDocumentData;
      const b=await createThumbnailFromText(title, headingTree, sourceFilePath);
      file.data.rawDocumentData.thumbnail={
        local: b,
      };
    }
    /* 이 시점엔 썸네일이 하나씩은 있다 */
    const results=await cloudinary.v2.uploader
      .upload(
        join(__dirname, 'public', file.data.rawDocumentData.thumbnail.local),{
          public_id: file.data.rawDocumentData.thumbnail.local.replace('/','').replaceAll('/', '-').replaceAll('.','-'),
          folder: 'blog/thumbnails',
          overwrite:false,
        }
      );
    /*console.log(results);*/
    file.data.rawDocumentData.thumbnail.cloudinary=
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_300,f_auto/${results.public_id}`;

    file.data.rawDocumentData.thumbnail.blurURL=await getBase64ImageUrl(file.data.rawDocumentData.thumbnail.cloudinary);
    /*console.log(file.data.rawDocumentData.thumbnail.blurURL)*/
  };
}