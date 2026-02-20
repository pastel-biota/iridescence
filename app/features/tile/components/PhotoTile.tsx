import type { FC } from "react";
import { css } from "styled-system/css";

type Props = {
  thumbnailUrl: string;
  className: string;
  rowSpan: number;
  colSpan: number;
  title: { jp: string; en: string };
  properties: {
    camera: string;
    aperture: number;
    shatter: number;
    iso: number;
    exposure: number;
    focus: number;
  };
};

export const PhotoTile: FC<Props> = ({ thumbnailUrl }) => {
  return (
    <article
      className={css({ width: "100%", height: "100%", objectFit: "cover" })}
    >
      <img
        src={thumbnailUrl}
        className={css({ width: "100%", height: "100%", objectFit: "cover" })}
      />
    </article>
  );
};
