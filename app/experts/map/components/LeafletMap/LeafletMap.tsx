import { type FC, lazy } from "react";

import { useHydrated } from "~/lib/use-hydrated";

import type { LeafletMapProps } from "./LeafletMapImpl";

const LeafletMapImpl = lazy(() =>
  import("./LeafletMapImpl").then((mod) => ({ default: mod.LeafletMapImpl })),
);

export const LeafletMap: FC<LeafletMapProps> = (props) => {
  // Leaflet touches `window`, so it can only render on the client. Deferring
  // until after hydration keeps the first client render matching the server.
  const hydrated = useHydrated();

  if (!hydrated) {
    return null;
  }

  return <LeafletMapImpl {...props} />;
};
