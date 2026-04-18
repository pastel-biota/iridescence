import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import { IRIS_BASE_URL } from "~/configs/client";

import type { paths } from "./schema";

export const irisClient = createFetchClient<paths>({
  baseUrl: IRIS_BASE_URL,
});
export const irisQuery = createClient(irisClient);
