import { type FC, useCallback, useEffect, useRef } from "react";
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

import { expectIndex } from "~/lib/data/expect-index";
import type { PhotoReference } from "~/models";

import { PhotoTile } from "../PhotoTile/PhotoTile";

type Props = {
  photos: PhotoReference[];
  onMoreRequested: () => void;
};

export const PhotoGrid: FC<Props> = ({ photos, onMoreRequested }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const handleViewIn = useCallback(() => {
    onMoreRequested();
  }, [onMoreRequested]);

  useEffect(() => {
    if (bottomRef.current == null) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry === undefined || entries.length !== 1) {
          throw new Error("Observing nothing or more than expected");
        }

        if (entry.intersectionRatio >= 1) {
          handleViewIn();
        }
      },
      {
        rootMargin: "0px 30%",
      },
    );

    observer.observe(bottomRef.current);

    return () => {
      observer.disconnect();
    };
  }, [handleViewIn]);

  return (
    <div className={root}>
      <ol className={photoGrid}>
        {photos.map((photo) => {
          const thumbnail = expectIndex(photo.images, "thumbnail");
          const icon = expectIndex(photo.images, "icon");

          return (
            <li className={css({ aspectRatio: 1 })} key={photo.id}>
              <PhotoTile
                photoId={photo.id}
                thumbnailUrl={thumbnail.imageUrl}
                blurUrl={icon.imageUrl}
                fallbackColor={photo.representativeColor}
              />
            </li>
          );
        })}
      </ol>
      <div ref={bottomRef} />
    </div>
  );
};

const root = css({
  marginInline: "auto",
  width: "100%",
});

const photoGrid = grid({
  gridTemplateColumns: {
    base: "repeat(auto-fill, minmax(150px, 1fr))",
    sm: "repeat(auto-fill, minmax(250px, 1fr))",
  },
  width: "100%",
  gap: "4px",
});
