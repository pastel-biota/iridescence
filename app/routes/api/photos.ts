import { irisClient } from "~/api/iris/client";
import type { components } from "~/api/iris/schema";
import { json } from "~/experts/react-router/response";

import type { Route } from "./+types/photos";

export const APIPhotoURL = "/api/photos";

export type APIPhotoResponse =
  components["schemas"]["SuccessfulResponse_GetPhotosListResponse"];

export async function loader({ request }: Route.LoaderArgs) {
  const cursor = new URL(request.url).searchParams.get("cursor");

  const photos = await irisClient.GET("/photos", {
    params: {
      query: {
        size: 30,
        cursor: cursor ?? undefined,
      },
    },
  });

  if (photos.error !== undefined) {
    throw new Error("GET /photos to the Iris failed");
  }

  return json(200, photos.data satisfies APIPhotoResponse);
}
