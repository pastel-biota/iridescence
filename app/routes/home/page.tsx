import { useCallback } from "react";

import { PhotoGrid } from "~/features/tile/components/PhotoGrid/PhotoGrid";
import { MainLayout } from "~/layouts/MainLayout";

import type { Route } from "./+types/page";
import { usePhotoList } from "./query";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Index() {
  const { data, fetchNextPage } = usePhotoList();

  const handleMore = useCallback(() => {
    console.log("Requesting more");
    void fetchNextPage();
  }, [fetchNextPage]);

  const photos = data?.pages.flatMap((page) => page);

  return (
    <MainLayout>
      {photos && <PhotoGrid photos={photos} onMoreRequested={handleMore} />}
    </MainLayout>
  );
}
