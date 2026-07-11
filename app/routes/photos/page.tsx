import { useCallback } from "react";
import { Outlet } from "react-router";
import { css } from "styled-system/css";

import { IRIDESCENCE_BASE_URL } from "~/configs/client";
import type { PhotoReference } from "~/entities/photo/model";
import { PhotoGrid } from "~/features/tile/components/PhotoGrid/PhotoGrid";
import { MainLayout } from "~/layouts/MainLayout";

import { SelectedPhotos } from "./_components/SelectedPhotos";
import type { Route } from "./+types/page";
import { usePhotoList } from "./query";
import { useSelectedPhotos } from "./state";

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
  const { photos: selectedPhotos, togglePhoto } = useSelectedPhotos();

  const { data, fetchNextPage } = usePhotoList();

  const handleMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  const handlePhotoShiftClick = useCallback(
    (photo: PhotoReference) => {
      togglePhoto(photo.id);
    },
    [togglePhoto],
  );

  const photos = data?.pages.flatMap((page) => page.photos);
  const totalCount = data?.pages.reduce(
    (currentMax, page): number => Math.max(currentMax, page.totalCount),
    0,
  );

  return (
    <MainLayout>
      <title>Iris // Photobook</title>

      {/* Image detail overlay comes to here */}
      <Outlet />
      {photos != null && totalCount != null && (
        <PhotoGrid
          photos={photos}
          totalCount={totalCount}
          onMoreRequested={handleMore}
          onShiftClick={handlePhotoShiftClick}
          selected={selectedPhotos}
        />
      )}

      <SelectedPhotos selected={selectedPhotos} style={selectedNotice} />
    </MainLayout>
  );
}

const selectedNotice = css.raw({
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
});
