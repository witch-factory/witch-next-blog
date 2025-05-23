export const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export function parseNumber(input: string, defaultValue: number): number {
  const parsed = typeof input === 'string' || typeof input === 'number'
    ? Number(input)
    : NaN;

  return Number.isNaN(parsed) ? defaultValue : parsed;
}
