import { membraneQuery } from "~/api/membrane/client";
import { mapPhoto } from "~/api/membrane/mappers";

export function usePhotoDetail(photoId: string) {
  return membraneQuery.useQuery(
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
      gcTime: Infinity,
    },
  );
}
