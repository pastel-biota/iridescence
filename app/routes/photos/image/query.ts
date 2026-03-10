import { queryOptions } from "@tanstack/react-query";

import { membraneQuery } from "~/api/membrane/client";
import { mapPhoto } from "~/api/membrane/mappers";

export function photoDetailQuery(photoId: string) {
  const query = membraneQuery.queryOptions("get", "/photos/{photo_id}", {
    params: {
      path: {
        photo_id: photoId,
      },
    },
  });

  return queryOptions({
    ...query,
    select: (photo) => mapPhoto(photo.response.photo),
    gcTime: Infinity,
  });
}
