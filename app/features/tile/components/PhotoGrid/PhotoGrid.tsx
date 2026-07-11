import { type FC, useCallback, useEffect, useRef } from "react";
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

import { PhotoTile } from "~/entities/photo/components/PhotoTile/PhotoTile";
import { type PhotoReference } from "~/entities/photo/model";

type Props = {
  photos: PhotoReference[];
  onMoreRequested: () => void;
  onShiftClick?: (photo: PhotoReference) => void;
  selected?: Set<string>;
};

export const PhotoGrid: FC<Props> = ({
  onShiftClick,
  photos,
  onMoreRequested,
  selected,
}) => {
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
        {photos.map((photo) => (
          <li key={photo.id} className={tile}>
            <PhotoTile
              photo={photo}
              onShiftClick={onShiftClick}
              selected={selected?.has(photo.id) ?? false}
            />
          </li>
        ))}
      </ol>
      <div ref={bottomRef} />
    </div>
  );
};

const root = css({
  marginInline: "auto",
  width: "100%",
  padding: "2px 0 0 2px",
});

const tile = css({
  aspectRatio: "1 / 1",
  padding: "0 2px 2px 0",
});

const photoGrid = grid({
  gridTemplateColumns: {
    base: "repeat(auto-fill, minmax(150px, 1fr))",
    sm: "repeat(auto-fill, minmax(200px, 1fr))",
  },
  width: "100%",
  gap: "0px",
});
