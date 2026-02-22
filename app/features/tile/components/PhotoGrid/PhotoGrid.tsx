import { type FC, useCallback, useEffect, useRef } from "react";
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

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
        if (entries.length !== 1) {
          throw new Error("Observing nothing or more than expected");
        }
        const entry = entries[0];

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
    <div>
      <ol className={root}>
        {photos.map((photo) => {
          const thumbnail = photo.images.find(({ id }) => id === "thumbnail");

          if (thumbnail == null) {
            throw new Error("Exepcted to have the thumbnail image");
          }

          return (
            <li className={css({ aspectRatio: 1 })} key={photo.id}>
              <PhotoTile
                photoId={photo.id}
                thumbnailUrl={thumbnail.imageUrl}
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

const root = grid({
  gridTemplateColumns: "repeat(auto-fill, minmax(max(24%, 250px), 1fr))",
  width: "100%",
  maxWidth: "1600px",
  marginInline: "auto",
  gap: "4px",
});
