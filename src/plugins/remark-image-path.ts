import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

import { DocumentKind, getPublicAssetUrl, isRelativeAssetPath } from '@/utils/content/assetPath';

export default function remarkImagePath(kind: DocumentKind = 'ko') {
  return function (tree: Root, file: VFile) {
    const meta = file.data._meta as { filePath?: string };
    const filePath = meta.filePath;

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
