import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import { MEMBRANE_BASE_URL } from "~/configs/client";

import type { paths } from "./schema";

export const membraneClient = createFetchClient<paths>({
  baseUrl: MEMBRANE_BASE_URL,
});
export const membraneQuery = createClient(membraneClient);
