import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";

function makeQueryClient(): QueryClient {
  return new QueryClient();
}

let browserQueryClient: QueryClient | undefined;

/**
 * On the server a QueryClient must never be shared across requests: its cache
 * would leak one user's authenticated data into another user's render (and,
 * with `gcTime: Infinity`, never evict). So the server gets a fresh client on
 * every call, while the browser reuses a singleton — recreating it per render
 * would discard in-flight requests and cached state.
 */
function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
