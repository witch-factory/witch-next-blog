export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const timeA = Date.parse(a.date);
    const timeB = Date.parse(b.date);
    return timeB - timeA;
  });
}
