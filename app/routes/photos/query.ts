import { irisQuery } from "~/api/iris/client";
import { mapPhotoReference } from "~/entities/photo/api/mappers";

export function usePhotoList() {
  return irisQuery.useInfiniteQuery(
    "get",
    "/photos",
    {},
    {
      pageParamName: "cursor",
      select: (data) => ({
        pages: data.pages.map((page) => ({
          photos: page.response.photos.map((photo) => mapPhotoReference(photo)),
          totalCount: page.response.total_count,
        })),
        pageParams: data.pageParams,
      }),
      getNextPageParam: (lastPage) => lastPage.response.next_cursor ?? null,
      initialPageParam: null as string | null,
    },
  );
}
