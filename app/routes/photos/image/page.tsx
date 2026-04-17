import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { css } from "styled-system/css";
import { grid, hstack, vstack } from "styled-system/patterns";

import { mapPhoto } from "~/api/membrane/mappers";
import { IRIDESCENCE_BASE_URL } from "~/configs/client";
import { CopyText } from "~/experts/dom/components/CopyText";
import { LocationProperty } from "~/features/photo/components/LocationProperty";
import { PropertyValue } from "~/features/photo/components/PropertyValue";
import { TILE_VIEW_TRANSITION_NAME } from "~/features/tile/style";
import { useViewTransitionFlags } from "~/lib/view-transition";
import { queryClient } from "~/provider";

import type { Route } from "./+types/page";
import { photoDetailQuery } from "./query";

export function meta(args: Route.MetaArgs) {
  const photo = mapPhoto(args.loaderData.response.photo);

  const thumbnail = photo.images["thumbnail"];
  if (thumbnail == null) {
    throw new Error("Thought thumbnail exists but wasn't");
  }

  return [
    {
      name: "og:url",
      content: `${IRIDESCENCE_BASE_URL}/photos/${args.params.id}/`,
    },
    { property: "og:title", content: "Iris // Photobook" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: thumbnail.imageUrl },
    { property: "og:image:width", content: thumbnail.width },
    { property: "og:image:height", content: thumbnail.height },
    { property: "og:image:type", content: thumbnail.mime },
  ];
}

export const loader = async (ctx: Route.LoaderArgs) => {
  const id = ctx.params.id;
  const photo = await queryClient.ensureQueryData(photoDetailQuery(id));

  return photo;
};

export default function ImageDetailPage({
  params: { id },
  loaderData,
}: Route.MetaArgs) {
  const { data: photo } = useQuery({
    ...photoDetailQuery(id),
    initialData: loaderData,
  });
  const { onPage } = useViewTransitionFlags(`/photos/${id}`);

  const blur = photo.images["icon"];
  const main = photo.images["main"];

  if (main === undefined) {
    throw new Error("Expected to have main image");
  }

  return (
    <div className={root} role="dialog">
      <Link
        to="/photos"
        className={overlayLink}
        viewTransition
        preventScrollReset
      >
        <div
          className={overlay}
          style={{
            backgroundColor: `color-mix(#ffffff 77%, ${photo.representativeColor} 13%)`,
          }}
        />
      </Link>
      <div className={content}>
        <img
          src={main.imageUrl}
          width={main.width}
          height={main.height}
          // src={"https://picsum.photos/id/120/1920/1080"}
          className={mainImage}
          style={{
            background: blur && `url(${blur.imageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            viewTransitionName: onPage ? TILE_VIEW_TRANSITION_NAME : undefined,
          }}
        />
        <aside className={properties}>
          <div className={fundamentalPhotoInfo}>
            <div
              className={representativeColorBox}
              style={{
                backgroundColor: photo.representativeColor,
              }}
            />
            <time className={dateTime} dateTime={photo.shotTime.toISOString()}>
              {getYMDText(photo.shotTime)}
            </time>
            <p className={idSection}>
              <span className={idLabel}>ID</span>
              <span className={idText}>{photo.id}</span>
              <CopyText textToCopy={photo.id} />
            </p>
          </div>
          <p className={vstack({ gap: 4, alignItems: "start" })}>
            <span className={cameraMachine}>{photo.properties?.machine}</span>
            <span className={cameraLens}>{photo.properties?.lens}</span>
          </p>
          <dl className={parameters}>
            {photo.properties?.fNumber != null && (
              <PropertyValue
                affix="F"
                value={photo.properties.fNumber}
                fixation="prefix"
              />
            )}
            {photo.properties?.fNumber != null && (
              <PropertyValue
                affix="1/"
                value={photo.properties.shutterSpeed}
                fixation="prefix"
              />
            )}
            {photo.properties?.fNumber != null && (
              <PropertyValue
                affix="ISO"
                value={photo.properties.iso}
                fixation="prefix"
              />
            )}
            {photo.properties?.fNumber != null && (
              <PropertyValue
                affix="mm"
                value={photo.properties.focal}
                fixation="suffix"
              />
            )}
          </dl>
          <LocationProperty latlng={photo.properties?.gpsLatLng} />
        </aside>
      </div>
    </div>
  );
}

function getYMDText(date: Date): string {
  const y = date.getFullYear().toString();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");

  return `${y}/${m}/${d}`;
}

const root = vstack({
  // brand new stacking context
  transform: "translate(0px)",
  position: "fixed",
  inset: 0,
  zIndex: 1,
  paddingX: {
    base: "4px",
    sm: "3vw",
  },
  paddingY: {
    base: "4px",
    sm: "40px",
  },
  justifyContent: "center",
});

const content = grid({
  gridTemplateRows: {
    base: "1fr auto",
    sm: "minmax(0, 1fr)",
  },
  gridTemplateColumns: {
    base: "1fr",
    sm: "3fr 1fr",
  },
  height: {
    base: "100%",
    sm: "auto",
  },
  alignItems: {
    base: "center",
    sm: "start",
  },
  gap: {
    base: "0",
    sm: "2vw",
  },
  width: "max-content",
  maxWidth: "100%",
  maxHeight: "100%",
  pointerEvents: "none",
});

const overlayLink = css({
  position: "absolute",
  inset: 0,
  zIndex: -1,
});

const overlay = css({
  position: "absolute",
  inset: 0,
  backdropFilter: "blur(128px)",
});

const mainImage = css({
  maxHeight: "100%",
  objectFit: "contain",
  objectPosition: "center",
  pointerEvents: "auto",
  marginInline: "auto",
});

const properties = vstack({
  alignItems: "start",
  gap: {
    base: "4px",
    sm: "24px",
  },
  paddingX: {
    base: "16px",
    sm: "0px",
  },
  paddingBottom: {
    base: "16px",
    sm: "0px",
  },
  pointerEvents: "auto",
  /* maxHeight: "80vh",
  height: "100%",
  marginY: "auto", */
});

const fundamentalPhotoInfo = vstack({
  alignItems: "start",
  width: "100%",
  gap: "2px",
});

const representativeColorBox = css({
  width: "40%",
  height: "4px",
  marginBottom: "8px",
});

const dateTime = css({
  fontFamily: "en",
  letterSpacing: "pack",
});

const idSection = hstack({
  alignItems: "baseline",
  gap: "4px",
});

const idLabel = hstack({
  color: "brand.identity",
  fontFamily: "metrics",
  fontSize: "xs",
  lineHeight: "none",
});

const idText = css({
  color: "brand.identity",
  fontFamily: "metrics",
  fontSize: "sm",
  lineHeight: "none",
  userSelect: "all",
  display: {
    base: "none",
    sm: "inline",
  },
});

const cameraMachine = css({
  fontFamily: "metrics",
  letterSpacing: "pack",
  lineHeight: "none",
  fontSize: "md",
});

const cameraLens = css({
  fontFamily: "metrics",
  letterSpacing: "pack",
  lineHeight: "none",
  fontSize: "sm",
  opacity: "50%",
});

const parameters = hstack({
  gap: "4px",
  opacity: "60%",
});
