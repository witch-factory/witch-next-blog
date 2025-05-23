import { Heading, Root as Mdast } from 'mdast';
import { visit } from 'unist-util-visit';

import { TocEntry } from '@/types/components';
import { createTitleSlug, uniqueId } from '@/utils/core/string';

import { extractHeadingText } from './parser';

// 제목이 중복되는 경우를 대비해서 id를 생성할 때 중복을 피하기 위해 숫자를 붙입니다.
export function createHeadingId(
  headingNode: Heading,
  idCounter: Map<string, number>,
): string {
  const title = extractHeadingText(headingNode);
  const baseId = createTitleSlug(title);
  return uniqueId(baseId, idCounter);
}

// headingNode를 가지고 headingTree의 tocEntry를 만들어낸다.
function appendHeadingToTocEntries(node: Heading, tocEntries: TocEntry[], depthMap: Record<number, TocEntry | undefined>, headingIdCounter: Map<string, number>) {
  const title = extractHeadingText(node);
  // console.log(node, title);

  const newNode: TocEntry = {
    title,
    url: '#' + createHeadingId(node, headingIdCounter),
    items: [],
  };
  // 현재 보고 있는 노드보다 1 depth 낮은 노드 중 가장 최근에 추가된 노드가 부모 노드가 된다.
  const parent = depthMap[node.depth - 1];
  if (parent) {
    parent.items.push(newNode);
    depthMap[node.depth] = newNode;
  }
  else {
    tocEntries.push(newNode);
    depthMap[node.depth] = newNode;
  }
}

export function generateHeadingTree(tree: Mdast) {
  const headingIdCounter = new Map<string, number>();
  const tocEntries: TocEntry[] = [];
  const depthMap: Record<number, TocEntry | undefined> = {};
  visit(tree, 'heading', (node: Heading) => {
    appendHeadingToTocEntries(node, tocEntries, depthMap, headingIdCounter);
  });
  return tocEntries;
}
