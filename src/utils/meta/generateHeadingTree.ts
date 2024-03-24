import { visit } from 'unist-util-visit';
import { UnistNode } from 'unist-util-visit/lib';

import { TocEntry } from '@/types/components';

type HeadingNode=UnistNode & {
  type: 'heading';
  depth: number;
  children: {
    type: 'text';
    value: string;
  }[];
  data?: {
    hProperties: {
      className: string;
    }
  }
};

function formatTitle(title: string) {
  // 정규식 [/.*,\s]/g는 '.', '/', '*', ',' 및 공백 문자를 모두 찾습니다.
  // 공백은 '-'로 치환되고, 나머지는 제거됩니다.
  return title.replace(/[\.\/\*,]/g, '').replace(/\s/g, '-').toLowerCase();
}

// 제목이 중복되는 경우를 대비해서 id를 생성할 때 중복을 피하기 위해 숫자를 붙입니다.
export function generateHeadingID(headingNode: HeadingNode, headingID: Record<string, number>) {
  const title = headingNode.children.map((node) => node.value).join('');
  const id = formatTitle(title);
  if (headingID[id]) {
    headingID[id] += 1;
    return id + '-' + headingID[id];
  }
  else {
    headingID[id] = 1;
    return id;
  }
}

function makeHeadingTree(node: HeadingNode, output: TocEntry[], depthMap: Record<number, TocEntry>, headingID: Record<string, number>) {
  const title = node.children.map((c) => c.value).join('');

  const newNode: TocEntry = {
    title,
    url:'#' + generateHeadingID(node, headingID),
    items:[],
  };
  // h1은 부모가 없다
  if (node.depth === 1) {
    output.push(newNode);
    depthMap[node.depth] = newNode;
  }
  else {
    const parent = depthMap[node.depth - 1];
    if (parent) {
      parent.items.push(newNode);
      depthMap[node.depth] = newNode;
    }
  }
}

export function generateHeadingTree(tree: UnistNode) {
  const headingID: Record<string, number> = {};
  const output: TocEntry[] = [];
  const depthMap = {};
  visit(tree, 'heading', (node: HeadingNode) => {
    // console.log(node);
    makeHeadingTree(node, output, depthMap, headingID);
  });
  console.log(output);
  return output;
}