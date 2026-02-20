import { membraneQuery } from "~/api/membrane/client";
import { mapPhotoReference } from "~/api/membrane/mappers";

export function usePhotoList() {
  return membraneQuery.useQuery(
    "get",
    "/photos",
    {
      params: {
        query: {
          size: 30,
          cursor: null,
        },
      },
    },
    {
      select: (data) => ({
        totalCount: data.response.total_count,
        photos: data.response.photos.map((photo) => mapPhotoReference(photo)),
      }),
    },
  );
}
