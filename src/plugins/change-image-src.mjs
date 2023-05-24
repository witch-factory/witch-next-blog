import {visit} from 'unist-util-visit';

const imageDirInPublic = 'images/posts';

export default function changeImageSrc() {
  return function(tree, file) {
    const filePath=file.data.rawDocumentData.flattenedPath;
    visit(tree, 'paragraph', function(node) {
      const image=node.children.find(child=>child.type==='image');

      if (image) {
        const fileName=image.url.replace('./', '');
        image.url=`/${imageDirInPublic}/${filePath}/${fileName}`;
      }
    });
  };
}