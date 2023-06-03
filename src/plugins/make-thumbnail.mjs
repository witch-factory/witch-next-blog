import {visit} from 'unist-util-visit';

// 모든 이미지 뽑아내기
function extractImgSrc(tree) {
  const images=[];
  visit(tree, 'image', (node)=>{
    images.push(node.url);
  });
  return images;
}

/*function extractHeading(tree) {
  const headings=[];
  visit(tree, 'heading', (node)=>{
    if (node.depth===1) {
      headings.push(node.children.map(c=>c.value).join(''));
    }
  });
  return headings;
}*/

export default function makeThumbnail() {
  return function(tree, file) {
    const images=extractImgSrc(tree);
    if (images.length>0) {
      file.data.rawDocumentData.thumbnail=images[0];
    }
    /*else {
      const headings=extractHeading(tree);
      if (headings.length>0) {
        file.data.rawDocumentData.thumbnail=headings[0];
      }
    }*/
  };
}