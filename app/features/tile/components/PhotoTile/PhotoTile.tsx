import { type FC, type ReactNode, useState } from "react";
import { Link } from "react-router";
import { css, cva, type Styles } from "styled-system/css";
import { hstack } from "styled-system/patterns";

import { useViewTransitionFlags } from "~/lib/view-transition";
import type { PhotoProperties } from "~/models";

import { usePhotoDetail } from "./query";

type Props = {
  photoId: string;
  blurUrl: string;
  thumbnailUrl: string;
  fallbackColor: string;
};

export const PhotoTile: FC<Props> = ({
  photoId,
  blurUrl,
  thumbnailUrl,
  fallbackColor,
}) => {
  const [hovered, setHovered] = useState(false);
  const photo = usePhotoDetail(photoId, hovered);
  const { offPage } = useViewTransitionFlags(`/photos/${photoId}`);

  return (
    <Link to={`/photos/${photoId}`} viewTransition preventScrollReset>
      <article
        className={`${root} group`}
        style={{
          backgroundColor: fallbackColor,
          backgroundImage: `url(${blurUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onMouseEnter={() => {
          setHovered(true);
        }}
      >
        <img src={thumbnailUrl} className={img({ isTransitioning: offPage })} />
        <PropertyPanel properties={photo.data?.properties} styles={panel} />
      </article>
    </Link>
  );
};

const root = css({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
});

const img = cva({
  base: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  variants: {
    isTransitioning: {
      true: {
        viewTransitionName: "image",
      },
    },
  },
});

const panel = css.raw({
  transform: {
    base: "translateY(100%)",
    _groupHover: "translateY(0%)",
  },
  transition: "150ms transform",
});

type PropertiesPanelProps = {
  styles?: Styles;
  properties: PhotoProperties | undefined;
};

const PropertyPanel: FC<PropertiesPanelProps> = ({ styles, properties }) => {
  if (properties == null) {
    return (
      <aside className={css(propertiesPanelRoot, styles)}>
        <span className={loadingText}>Loading...</span>
      </aside>
    );
  }

  return (
    <aside className={css(propertiesPanelRoot, styles)}>
      <span className={machineName}>{properties.machine}</span>
      <div className={supplymental}>
        {properties.fNumber != null && (
          <PropertyValue prefix="F/" value={properties.fNumber} />
        )}
        {properties.shutterSpeed != null && (
          <PropertyValue prefix="1/" value={properties.shutterSpeed} />
        )}
        {properties.iso != null && (
          <PropertyValue prefix="ISO" value={properties.iso} />
        )}
        {properties.focal != null && (
          <PropertyValue suffix="mm" value={properties.focal.toFixed(1)} />
        )}
      </div>
    </aside>
  );
};

const propertiesPanelRoot = hstack.raw({
  position: "absolute",
  left: 0,
  bottom: 0,
  right: 0,
  paddingX: "12px",
  paddingY: "6px",
  backgroundColor: "#0005",
  gap: "4px",
  color: "white",
  flexWrap: "wrap",
  alignItems: "end",
});

const machineName = css({
  fontFamily: "metrics",
  fontSize: "12px",
  lineHeight: "100%",
  letterSpacing: "-4%",
});

const loadingText = css({
  fontFamily: "metrics",
  fontSize: "12px",
  textAlign: "center",
  lineHeight: "100%",
  width: "100%",
  letterSpacing: "-2%",
});

const supplymental = hstack({
  gap: "4px",
  opacity: "80%",
  flexWrap: "wrap",
});

type PropertyProps = {
  prefix?: ReactNode;
  value: ReactNode;
  suffix?: ReactNode;
};

const PropertyValue: FC<PropertyProps> = ({ prefix, value, suffix }) => {
  return (
    <span className={propertyRoot}>
      {prefix != null && <span className={fixupsText}>{prefix}</span>}
      {value != null && <span className={valueText}>{value}</span>}
      {suffix != null && <span className={fixupsText}>{suffix}</span>}
    </span>
  );
};

const propertyRoot = css({
  fontFamily: "metrics",
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "-3%",
});

const fixupsText = css({
  fontSize: "10px",
  lineHeight: "100%",
});

const valueText = css({
  fontSize: "12px",
  lineHeight: "100%",
});
