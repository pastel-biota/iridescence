import { queryOptions } from "@tanstack/react-query";

import { irisQuery } from "~/api/iris/client";
import { mapPhoto } from "~/entities/photo/api/mappers";

export function photoDetailQuery(photoId: string) {
  const query = irisQuery.queryOptions("get", "/photos/{photo_id}", {
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
