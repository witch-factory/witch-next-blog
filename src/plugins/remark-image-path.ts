import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { DocumentKind, getPublicAssetUrl, isRelativeAssetPath } from '@/utils/content/assetPath';

export default function remarkImagePath(kind: DocumentKind = 'ko') {
  return function (tree: Root, file: VFile) {
    const filePath = file.path ?? (typeof file.data._meta === 'object' && file.data._meta && 'filePath' in file.data._meta
      ? String(file.data._meta.filePath)
      : undefined);

    if (!filePath) {
      return;
    }

    visit(tree, 'image', (imageNode) => {
      if (!isRelativeAssetPath(imageNode.url)) {
        return;
      }

      imageNode.url = getPublicAssetUrl(filePath, imageNode.url, kind);
    });
  };
}
