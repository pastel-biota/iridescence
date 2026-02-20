import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

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
  const { data } = usePhotoList();

  return (
    <MainLayout>
      <ol className={root}>
        {data?.photos.map((photo) => (
          <li className={css({ aspectRatio: 1 })}>
            <img src={photo.images[0].imageUrl} className={image} />
          </li>
        ))}
      </ol>
    </MainLayout>
  );
}

const root = grid({
  gridTemplateColumns: "repeat(auto-fill, minmax(max(24%, 300px), 1fr))",
  width: "100%",
  maxWidth: "1600px",
  paddingInline: "32px",
  marginInline: "auto",
});

const image = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});
