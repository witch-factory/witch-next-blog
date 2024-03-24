import { visit } from 'unist-util-visit';
import { UnistNode } from 'unist-util-visit/lib';

import { generateHeadingID } from '@/utils/meta/generateHeadingTree';

// 각 Heading에 id 속성을 추가해 주는 역할을 하는 플러그인
// toc 배열을 정말로 만드는 과정은 custom schema에서 담당한다

type HeadingNode = UnistNode & {
  type: 'heading';
  depth: number;
  children: {
    type: 'text';
    value: string;
  }[];
  data?: {
    hProperties: {
      id: string;
    }
  }
};

function addIDToNode(node: HeadingNode, id: string) {
  node.data = node.data || {
    hProperties:{
      id,
    }
  };
}

export function addIDToHeadingNodes(tree: UnistNode) {
  const headingID = {};
  visit(tree, 'heading', (node) => {
    const id = generateHeadingID(node, headingID);
    addIDToNode(node, id);
    // console.log(node);
  });
  // console.log(output);
}

export default function headingTree() {
  return (tree: UnistNode)=>{
    //console.log(tree);
    addIDToHeadingNodes(tree);
  };
}