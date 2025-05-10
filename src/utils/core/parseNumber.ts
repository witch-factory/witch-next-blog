export function parseNumber(input: unknown, defaultValue: number): number {
  const parsed = typeof input === 'string' || typeof input === 'number'
    ? Number(input)
    : NaN;

  return Number.isNaN(parsed) ? defaultValue : parsed;
}
