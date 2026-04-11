import path from 'path';

import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

export default function remarkImagePath() {
  return function (tree: Root, file: VFile) {
    const filePath = file.path ?? (typeof file.data._meta === 'object' && file.data._meta && 'filePath' in file.data._meta
      ? String(file.data._meta.filePath)
      : undefined);

    if (!filePath) {
      return;
    }

    const articleSlugPath = path.basename(path.dirname(filePath));
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
