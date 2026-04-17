import { useCallback } from "react";
import { Outlet } from "react-router";

import { IRIDESCENCE_BASE_URL } from "~/configs/client";
import { PhotoGrid } from "~/features/tile/components/PhotoGrid/PhotoGrid";
import { MainLayout } from "~/layouts/MainLayout";

import type { Route } from "./+types/page";
import { usePhotoList } from "./query";

export function meta(_args: Route.MetaArgs) {
  return [
    { property: "og:url", content: `${IRIDESCENCE_BASE_URL}/photos/` },
    { property: "og:title", content: "Iris // Photobook" },
    {
      property: "og:description",
      content: "A collection of things I thought banger",
    },
    { name: "description", content: "A collection of things I thought banger" },
    { property: "og:type", content: "website" },
  ];
}

export default function Index() {
  const { data, fetchNextPage } = usePhotoList();

  const handleMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  const photos = data?.pages.flatMap((page) => page);

  return (
    <MainLayout>
      <title>Iris // Photobook</title>

      {/* Image detail overlay comes to here */}
      <Outlet />
      {photos && <PhotoGrid photos={photos} onMoreRequested={handleMore} />}
    </MainLayout>
  );
}
