import { createFinalURL } from "openapi-fetch";
import { defaultPathSerializer } from "openapi-fetch/dist/index.cjs";

import { IRIS_BASE_URL } from "~/configs/client";

import type { paths } from "./schema";

export function getImageServeUrl(photoId: string, imageId: string): string {
  return createFinalURL<paths>(
    "/photos/{photo_id}/images/{image_id}" satisfies keyof paths,
    {
      baseUrl: IRIS_BASE_URL,
      params: {
        query: undefined,
        path: {
          photo_id: photoId,
          image_id: imageId,
        },
      },
      pathSerializer: defaultPathSerializer,
      querySerializer: (query) => {
        return new URLSearchParams(query as Record<string, string>).toString();
      },
    },
  );
}
