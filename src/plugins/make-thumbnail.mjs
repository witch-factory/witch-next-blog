import fs from 'fs/promises';
import {join} from 'path';
import path from 'path';

import { createCanvas, GlobalFonts, Image } from '@napi-rs/canvas';
import {visit} from 'unist-util-visit';

const __dirname = path.resolve();
GlobalFonts.registerFromPath(join(__dirname, 'fonts', 'NotoSansKR-Bold.otf'), 'NotoSansKR');

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

async function createThumbnailFromText(title, headings, filePath) {
  const width=400;
  const height=300;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000';

  title=stringWrap(title, 15);
  title=title.split('\n');
  //console.log(title);
  ctx.font = '40px NotoSansKR';
  for (let i=0; i<title.length; i++) {
    ctx.fillText(title[i], 0, 50+50*i);
  }

  const headingTexts=[];
  for (let h of headings) {
    const headingText=h.data.hProperties.title.replaceAll('. ', '-');
    headingTexts.push(headingText);
  }
  headingTexts.push('...');
  ctx.font = '20px NotoSansKR';
  for (let i=0; i<headingTexts.length; i++) {
    ctx.fillText(headingTexts[i], 0, 150+25*i);
  }

  ctx.font = '20px NotoSansKR';
  ctx.fillText('Witch-work', 50, 250);

  const hatImage = await fs.readFile(join(__dirname, 'public', 'witch-hat.svg'));
  const image=new Image();
  image.src=hatImage;

  image.width=40;
  image.height=40;

  ctx.drawImage(image, 0, 220);


  const fileName=`${filePath.replaceAll('/', '-').replaceAll('.','-')}-thumbnail.png`;

  const pngData=await canvas.encode('png');

  await fs.writeFile(join(__dirname, 'public', 'thumbnails', fileName), pngData);

  const result=`/thumbnails/${fileName}`;

  return result;
}

export default function makeThumbnail() {
  return async function(tree, file) {
    const images=extractImgSrc(tree);
    if (images.length>0) {
      file.data.rawDocumentData.thumbnail=images[0];
    }
    else {
      const title=file.value.split('\n')[1].replace('title: ', '');
      const thumbnailHeadings=file.data.rawDocumentData.headingTree.slice(0, 2);

      const b=await createThumbnailFromText(title, thumbnailHeadings, file.data.rawDocumentData.sourceFilePath);
      file.data.rawDocumentData.thumbnail=b;
    }
  };
}