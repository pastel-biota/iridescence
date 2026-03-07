import { membraneQuery } from "~/api/membrane/client";
import { mapPhotoReference } from "~/api/membrane/mappers";

export function usePhotoList() {
  return membraneQuery.useInfiniteQuery(
    "get",
    "/photos",
    {
      params: {
        query: {
          size: 30,
        },
      },
    },
    {
      pageParamName: "cursor",
      select: (data) => ({
        pages: data.pages.map((page) =>
          page.response.photos.map((photo) => mapPhotoReference(photo)),
        ),
        pageParams: data.pageParams,
      }),
      getNextPageParam: (lastPage) => lastPage.response.next_cursor,
      initialPageParam: null,
    },
  );
}
