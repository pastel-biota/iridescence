import { irisQuery } from "~/api/iris/client";

import { mapPhoto } from "./mappers";

export function usePhotoDetail(photoId: string, enabled: boolean) {
  return irisQuery.useQuery(
    "get",
    "/photos/{photo_id}",
    {
      params: {
        path: {
          photo_id: photoId,
        },
      },
    },
    {
      select: (photo) => mapPhoto(photo.response.photo),
      enabled,
      gcTime: Infinity,
    },
  );
}
