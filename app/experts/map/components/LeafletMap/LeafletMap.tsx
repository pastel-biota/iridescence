import { type FC, lazy } from "react";

import type { LeafletMapProps } from "./LeafletMapImpl";

const LeafletMapImpl = lazy(() =>
  import("./LeafletMapImpl").then((mod) => ({ default: mod.LeafletMapImpl })),
);

export const LeafletMap: FC<LeafletMapProps> = (props) => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return <LeafletMapImpl {...props} />;
};
