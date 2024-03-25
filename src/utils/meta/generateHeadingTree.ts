// import { Heading, PhrasingContent, RootContent } from 'mdast';
import { Heading, PhrasingContent, Root as Mdast } from 'mdast';
import { visit } from 'unist-util-visit';

import { TocEntry } from '@/types/components';

// gfm markdown https://github.github.com/gfm/
function generateURLFromTitle(title: string) {
  // 정규식 /[\.\/\*,]/g,는 '.', '/', '*', ','를 모두 찾는다.
  // 정규식 /\[\^.*?\]/g는 '[^'로 시작하고 ']'로 끝나는 문자열(주석)을 찾는다.
  // 공백은 '-'로 치환되고, 나머지는 제거된다.
  // '$'는 제거된다.
  const formattedTitle = title.trim().replace(/\[\^.*?\]|[\.\/\*,]/g, '').replace(/\s/g, '-').replaceAll('$', '').toLowerCase();
  return formattedTitle;
}

function generateTitleArrayByDFS(node: PhrasingContent | Heading, titleArray: string[]) {
  switch (node.type) {
  case 'text':
  case 'inlineCode':
  case 'inlineMath':
    titleArray.push(node.value);
    break;
  case 'image':
  case 'imageReference':
    titleArray.push(node.alt ?? '');
    break;
  case 'html':
  case 'break':
  case 'footnoteReference':
  case 'delete':
    break;
  default:
    if ('children' in node) {
      for (const child of node.children) {
        generateTitleArrayByDFS(child, titleArray);
      }
    }
  }
}

function generateTitleFromHeadingNode(node: Heading) {
  const titleArray: string[] = [];
  generateTitleArrayByDFS(node, titleArray);

  return titleArray.join('');
}

// 제목이 중복되는 경우를 대비해서 id를 생성할 때 중복을 피하기 위해 숫자를 붙입니다.
export function generateHeadingID(headingNode: Heading, headingID: Record<string, number>) {
  const title = generateTitleFromHeadingNode(headingNode);
  const id = generateURLFromTitle(title);
  if (headingID[id]) {
    headingID[id] += 1;
    return id + '-' + headingID[id];
  }
  else {
    headingID[id] = 1;
    return id;
  }
}

// headingNode를 가지고 headingTree의 tocEntry를 만들어낸다.
function processHeadingNode(node: Heading, output: TocEntry[], depthMap: Record<number, TocEntry>, headingID: Record<string, number>) {
  const title = generateTitleFromHeadingNode(node);
  // console.log(node, title);

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

export function generateHeadingTree(tree: Mdast) {
  const headingID: Record<string, number> = {};
  const output: TocEntry[] = [];
  const depthMap = {};
  visit(tree, 'heading', (node: Heading) => {
    processHeadingNode(node, output, depthMap, headingID);
  });
  // console.log(output);
  return output;
}