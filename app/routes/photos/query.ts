import { useInfiniteQuery } from "@tanstack/react-query";

import { mapPhotoViewReference } from "~/api/iris/mappers";
import { IRIDESCENCE_BASE_URL } from "~/configs/client";

import { type APIPhotoResponse, APIPhotoURL } from "../api/photos";

export function usePhotoList() {
  return useInfiniteQuery({
    queryKey: ["internal", APIPhotoURL],
    queryFn: async ({ pageParam }): Promise<APIPhotoResponse> => {
      const url = new URL(APIPhotoURL, IRIDESCENCE_BASE_URL);
      if (pageParam != null) {
        url.searchParams.set("cursor", pageParam);
      }

      const req = await fetch(url);
      return (await req.json()) as APIPhotoResponse;
    },
    select: (data) => ({
      pages: data.pages.map((page) =>
        page.response.photos.map((photo) => mapPhotoViewReference(photo)),
      ),
      pageParams: data.pageParams,
    }),
    getNextPageParam: (lastPage) => lastPage.response.next_cursor ?? null,
    initialPageParam: null as string | null,
  });
}
