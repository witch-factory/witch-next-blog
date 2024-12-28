import path from 'path';

import { Root } from 'mdast';
import { VFile } from 'rehype-katex/lib';
import { visit } from 'unist-util-visit';

export default function remarkImagePath() {
  return function (tree: Root, file: VFile) {
    const articleSlugPath = path.basename(path.dirname(file.path));
    const updatedDir = `../../posts`;

    visit(tree, 'image', (imageNode) => {
      const fileName = imageNode.url.replace('./', '');
      const updatedPath = `${updatedDir}/${articleSlugPath}/${fileName}`;
      // console.log('이미지 경로 ', updatedPath);
      imageNode.url = updatedPath;
      // console.log('이미지 노드 ', imageNode);
    });
  };
}
