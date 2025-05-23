import { Heading, PhrasingContent } from 'mdast';

/**
 * 마크다운 노드를 DFS로 순회하면서 텍스트 추출
 * @param node - 마크다운 노드 (텍스트, 이미지, 인라인 코드 등)
 * @param textArray - 추출된 텍스트를 저장할 배열
 */
function extractTextFromNode(node: PhrasingContent | Heading, textArray: string[]): void {
  switch (node.type) {
    // 텍스트 값이 있는 노드들
    case 'text':
    case 'inlineCode':
    case 'inlineMath':
      textArray.push(node.value);
      break;

    // 이미지 노드 - alt 텍스트 사용
    case 'image':
    case 'imageReference':
      textArray.push(node.alt ?? '');
      break;

    // 텍스트가 없는 노드들 - 무시
    case 'html':
    case 'break':
    case 'footnoteReference':
    case 'delete':
      break;

    // 자식 노드가 있는 경우 재귀 탐색
    default:
      if ('children' in node) {
        for (const child of node.children) {
          extractTextFromNode(child, textArray);
        }
      }
  }
}

/**
 * 헤딩 노드에서 모든 텍스트를 추출해서 하나의 문자열로 반환
 * @param headingNode - 마크다운 헤딩 노드
 * @returns 추출된 텍스트 문자열
 */
export function extractHeadingText(headingNode: Heading): string {
  const textArray: string[] = [];
  extractTextFromNode(headingNode, textArray);
  return textArray.join('');
}
