import { inArray } from "drizzle-orm";
import type { MergeDeep } from "type-fest";

import { membraneClient } from "~/api/membrane/client";
import type { components } from "~/api/membrane/schema";
import { json } from "~/experts/react-router/response";
import { database } from "~/infra/db/init";
import { photoConfig } from "~/infra/db/schema";

import type { Route } from "./+types/photos";

export const APIPhotoURL = "/api/photos";

export type APIPhotoResponse = MergeDeep<
  components["schemas"]["SuccessfulResponse_GetImagesListResponse"],
  {
    response: {
      photos: Array<
        components["schemas"]["PhotoReferenceSchema"] & {
          rows: number;
          cols: number;
        }
      >;
    };
  }
>;

export async function loader({ context, request }: Route.LoaderArgs) {
  const cursor = new URL(request.url).searchParams.get("cursor");

  const photos = await membraneClient.GET("/photos", {
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

  const db = database(context.cloudflare.env.DB);
  const photoConfigs = await db
    .select()
    .from(photoConfig)
    .where(
      inArray(
        photoConfig.id,
        photos.data.response.photos.map((photo) => photo.id),
      ),
    );

  return json(200, {
    ...photos.data,
    response: {
      ...photos.data.response,
      photos: photos.data.response.photos.map((photo) => {
        const config = photoConfigs.find((config) => config.id === photo.id);
        return {
          ...photo,
          cols: config?.cols ?? 1,
          rows: config?.rows ?? 1,
        };
      }),
    },
  } satisfies APIPhotoResponse);
}
