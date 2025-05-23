import { Heading, Root as Mdast } from 'mdast';
import { visit } from 'unist-util-visit';

import { createHeadingId } from '@/builder/markdown/headingTree';

// 각 Heading에 id 속성을 추가해 주는 역할을 하는 플러그인
// toc 배열을 정말로 만드는 과정은 custom schema에서 담당한다

function addIDToNode(node: Heading, id: string) {
  node.data = node.data ?? {
    hProperties: {
      id,
    },
  };
}

export function addIDToHeadingNodes(tree: Mdast) {
  const headingIdCounter = new Map<string, number>();
  visit(tree, 'heading', (node) => {
    const id = createHeadingId(node, headingIdCounter);
    addIDToNode(node, id);
  });
}

export default function remarkHeadingTree() {
  return (tree: Mdast) => {
    addIDToHeadingNodes(tree);
  };
}
