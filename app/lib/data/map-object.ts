export function mapObject<T, U>(
  obj: Record<string, T>,
  mapper: (key: string, value: T) => U,
): Record<string, U> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, mapper(k, v)]),
  );
}
