export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function hasKeyword<T extends object>(
  item: T,
  keyword: string,
  fields: (keyof T)[],
): boolean {
  if (!keyword) return true;

  const lowerCaseKeyword = keyword.toLowerCase();

  return fields.some((field) => {
    const value = item[field];
    return (
      typeof value === 'string'
      && value.toLowerCase().includes(lowerCaseKeyword)
    );
  });
}
