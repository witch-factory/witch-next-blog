export function filterItemsByKeyword<T extends object>(
  items: T[],
  keyword: string,
  fields: (keyof T)[],
): T[] {
  if (!keyword) return items;

  const lowerCaseKeyword = keyword.toLowerCase();

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return (
        typeof value === 'string'
        && value.toLowerCase().includes(lowerCaseKeyword)
      );
    }),
  );
}
