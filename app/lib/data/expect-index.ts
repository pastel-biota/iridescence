export function expectIndex<K>(
  object: K,
  key: Extract<keyof K, string | number>,
): K[typeof key] {
  const referenced = object[key];
  if (referenced === undefined) {
    throw new Error(`Expected to have the key ${String(key)}`);
  }

  return referenced;
}
