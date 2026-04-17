import type { FC } from "react";
import { css } from "styled-system/css";
import { hstack, vstack } from "styled-system/patterns";

import { LeafletMap } from "~/experts/map/components/LeafletMap";
import { externalMapLinks } from "~/experts/map/externals";
import type { LatLngTuple } from "~/models";

type Props = {
  latlng: LatLngTuple | null | undefined;
};

export const LocationProperty: FC<Props> = ({ latlng }) => {
  if (latlng == null) {
    return <span className={noLocation}>No location available</span>;
  }

  return (
    <div className={root}>
      <LeafletMap className={map} latlng={latlng} />
      <MapLinks latlng={latlng} />
    </div>
  );
};

type MapLinksProps = {
  latlng: LatLngTuple;
};

const MapLinks: FC<MapLinksProps> = ({ latlng }) => {
  return (
    <ul className={mapProvidersList}>
      {externalMapLinks.map((link) => (
        <li>
          <a
            href={link.urlGenerator(latlng)}
            target="_blank"
            rel="noreferrer nooperner"
            className={mapProvider}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

const root = vstack({
  width: "100%",
  gap: "12px",
});

const noLocation = css({
  fontFamily: "en",
  fontSize: "sm",
  fontStyle: "italic",
  opacity: "50%",
});

const map = css({
  display: {
    base: "none",
    sm: "block",
  },
  width: "100%",
  aspectRatio: "4 / 3",
});

const mapProvidersList = hstack({
  fontFamily: "en",
  fontSize: "xs",
  lineHeight: "100%",
  alignItems: "start",
  width: "100%",
  flexWrap: "wrap",
  gap: "8px 12px",
});

const mapProvider = css({
  textDecoration: "underline",
  color: {
    base: "brand.identity",
    _visited: "rose.identity",
  },
});
