export const createTagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export function createTitleSlug(title: string) {
  // 정규식 /[\.\/\*,]/g,는 '.', '/', '*', ','를 모두 찾는다.
  // 정규식 /\[\^.*?\]/g는 '[^'로 시작하고 ']'로 끝나는 문자열(주석)을 찾는다.
  return title
    .trim()
    .replace(/\[\^.*?\]|[\.\/\*,]/g, '') // 주석과 특수문자 제거
    .replace(/\s/g, '-') // 공백을 '-'로 치환
    .replaceAll('$', '') // '$' 제거
    .toLowerCase();
}

export function parseNumber(input: string, defaultValue: number): number {
  const parsed = typeof input === 'string' || typeof input === 'number'
    ? Number(input)
    : NaN;

  return Number.isNaN(parsed) ? defaultValue : parsed;
}

export function uniqueId(
  baseId: string,
  idCounter: Map<string, number>,
): string {
  if (idCounter.has(baseId)) {
    const newCount = (idCounter.get(baseId) ?? 0) + 1;
    idCounter.set(baseId, newCount);
    return `${baseId}-${newCount}`;
  }
  else {
    idCounter.set(baseId, 1);
    return baseId;
  }
}
