import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and React's first client render (hydration), then
 * `true` afterwards. Use this to gate rendering of browser-only content (e.g.
 * things that touch `window`) without causing a hydration mismatch — unlike
 * `typeof window !== "undefined"`, which flips to `true` during hydration and
 * diverges from the server-rendered HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
