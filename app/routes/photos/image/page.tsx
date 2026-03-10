import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { css, cva } from "styled-system/css";
import { grid, hstack, vstack } from "styled-system/patterns";

import { PropertyValue } from "~/features/photo/components/PropertyValue/PropertyValue";
import { useViewTransitionFlags } from "~/lib/view-transition";
import { queryClient } from "~/provider";

import type { Route } from "./+types/page";
import { photoDetailQuery } from "./query";

export const loader = async (ctx: Route.LoaderArgs) => {
  const id = ctx.params.id;
  const photo = await queryClient.ensureQueryData(photoDetailQuery(id));
  console.log(`Prefetched for ${id}`);

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

  const blur = photo.images.find((image) => image.id == "icon");
  const main = photo.images.find((image) => image.id == "main");

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
          className={mainImage({ transitioningOff: onPage })}
          style={{
            background: blur && `url(${blur.imageUrl})`,
            backgroundColor: photo.representativeColor,
            backgroundPosition: "center",
            backgroundSize: "cover",
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
  padding: {
    base: "20px",
    sm: "96px",
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
  gap: "64px",
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

const mainImage = cva({
  base: {
    maxHeight: "100%",
    objectFit: "contain",
    objectPosition: "center",
    pointerEvents: "auto",
    marginInline: "auto",
  },
  variants: {
    transitioningOff: {
      true: {
        viewTransitionName: "image",
      },
    },
  },
});

const properties = vstack({
  alignItems: "start",
  gap: {
    base: "4px",
    sm: "24px",
  },
  pointerEvents: "auto",
});

const fundamentalPhotoInfo = vstack({
  alignItems: "start",
  width: "100%",
});

const representativeColorBox = css({
  width: "40%",
  height: "4px",
});

const dateTime = css({
  fontFamily: "en",
  letterSpacing: "pack",
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
