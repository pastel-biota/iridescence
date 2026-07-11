import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import { IRIS_BASE_URL } from "~/configs/client";

import type { paths } from "./schema";

export const irisClient = createFetchClient<paths>({
  baseUrl: IRIS_BASE_URL,
  credentials: "include",
});

/**
 * Browser-only 401 handling: client-side queries (react-query) hit Iris
 * directly, so an expired/missing session comes back as a silent 401 with no
 * loader to catch it. Redirect the whole tab to /login so the user can
 * re-authenticate. Server-side loaders run without `window` and handle their
 * own redirects (see `fetchPhotoDetail`), so they're intentionally excluded.
 */
irisClient.use({
  onResponse({ response }) {
    if (
      typeof window !== "undefined" &&
      response.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      window.location.assign("/login");
    }

    return response;
  },
});

export const irisQuery = createClient(irisClient);
