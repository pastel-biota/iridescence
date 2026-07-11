import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { type FC, useEffect, useRef } from "react";
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

import { PhotoTile } from "~/entities/photo/components/PhotoTile/PhotoTile";
import { type PhotoReference } from "~/entities/photo/model";
import { useBasedOnResize } from "~/lib/use-on-resize";

type Props = {
  photos: PhotoReference[];
  totalCount: number;
  onMoreRequested: () => void;
  onShiftClick?: (photo: PhotoReference) => void;
  selected?: Set<string>;
};

export const PhotoGrid: FC<Props> = ({
  onShiftClick,
  totalCount,
  photos,
  onMoreRequested,
  selected,
}) => {
  const containerRef = useRef<HTMLOListElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [columnCount, gridSize] = useBasedOnResize(containerRef, (entry) => {
    const width = entry.contentRect.width;
    const minimumItemSize = 200 + 2;
    const columnCount = Math.max(1, Math.floor(width / minimumItemSize));

    return [columnCount, width / columnCount];
  }) ?? [1, null];

  const virtualizer = useWindowVirtualizer({
    count: Math.ceil(totalCount / columnCount),
    estimateSize: () => gridSize ?? 320,
    getItemKey: (index) => photos[index]?.id ?? index,
    overscan: 2,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const paddingTop = virtualItems[0]?.start ?? 0;
  const paddingBottom =
    virtualItems.length > 0
      ? virtualizer.getTotalSize() -
        (virtualItems[virtualItems.length - 1]?.end ?? 0)
      : 0;

  const lastColumnIndex = virtualItems.at(-1)?.index;

  useEffect(() => {
    if (lastColumnIndex == null) {
      return;
    }

    // TODO: Address the case when the photo's array can be prepended (backward infinite scroll)
    if (lastColumnIndex + 2 > Math.floor(photos.length / columnCount)) {
      onMoreRequested();
    }
  }, [columnCount, onMoreRequested, photos.length, lastColumnIndex]);

  return (
    <div className={root}>
      <ol
        className={photoGrid}
        ref={containerRef}
        style={{
          paddingTop: `${paddingTop.toString()}px`,
          paddingBottom: `${paddingBottom.toString()}px`,
        }}
      >
        {virtualizer.getVirtualItems().flatMap((virtual) => {
          const rowIndex = virtual.index;
          const globalIndex = rowIndex * columnCount;
          const photosInRow = photos.slice(
            globalIndex,
            globalIndex + columnCount,
          );

          return Array.from({ length: columnCount }).map((_, index) => {
            const photo = photosInRow[index];
            return (
              <li
                key={
                  photo?.id ?? `${virtual.index.toString()}-${index.toString()}`
                }
                className={tile}
              >
                {photo && (
                  <PhotoTile
                    photo={photo}
                    onShiftClick={onShiftClick}
                    selected={selected?.has(photo.id) ?? false}
                  />
                )}
              </li>
            );
          });
        })}
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
  position: "relative",
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
