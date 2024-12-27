export function parsePage(page: string, defaultValue = 1): number {
  const parsed = Number(page);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}
