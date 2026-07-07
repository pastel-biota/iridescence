import {
  type FC,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useState,
} from "react";
import { Link } from "react-router";
import { css, cva, type Styles } from "styled-system/css";
import { hstack } from "styled-system/patterns";

import { usePhotoDetail } from "~/entities/photo/api/query";
import {
  getImageBySize,
  type PhotoProperties,
  type PhotoReference,
} from "~/entities/photo/model";
import { TILE_VIEW_TRANSITION_NAME } from "~/features/tile/style";
import { useViewTransitionFlags } from "~/lib/view-transition";

type Props = {
  photo: PhotoReference;
  onShiftClick?: (photo: PhotoReference) => void;
  selected?: boolean;
};

export const PhotoTile: FC<Props> = ({ onShiftClick, photo, selected }) => {
  const [hovered, setHovered] = useState(false);
  const photoDetail = usePhotoDetail(photo.id, hovered);
  const { offPage } = useViewTransitionFlags(`/photos/${photo.id}`);

  const thumbnail = getImageBySize(photo.images, 320);
  const icon = getImageBySize(photo.images, 80);

  const handleTileClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      if (onShiftClick === undefined) {
        return;
      }

      if (e.shiftKey) {
        e.preventDefault();
        onShiftClick(photo);
      }
    },
    [onShiftClick, photo],
  );

  return (
    <Link
      className="group"
      to={`/photos/${photo.id}`}
      viewTransition
      preventScrollReset
      onClick={handleTileClick}
    >
      <article
        className={root({ selected })}
        style={{
          backgroundColor: photo.representativeColor,
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...(icon === null
            ? {}
            : {
                backgroundImage: `url(${icon.imageUrl})`,
              }),
          viewTransitionName: offPage ? TILE_VIEW_TRANSITION_NAME : undefined,
        }}
        onMouseEnter={() => {
          setHovered(true);
        }}
      >
        {thumbnail && <img src={thumbnail.imageUrl} className={img} />}
        <PropertyPanel
          properties={photoDetail.data?.properties}
          styles={panel}
        />
      </article>
    </Link>
  );
};

const root = cva({
  base: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    _groupFocusVisible: {
      outline: "2px solid {colors.brand.primary}",
      outlineOffset: "-2px",
    },
  },
  variants: {
    selected: {
      true: {
        outline: "6px solid {colors.brand.primary}",
        outlineOffset: "-10px",
      },
    },
  },
});

const img = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const panel = css.raw({
  transform: {
    base: "translateY(100%)",
    _groupHover: "translateY(0%)",
  },
  transition: "50ms transform",
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
  paddingY: "5px 6px",
  backgroundColor: "#0005",
  gap: "1px 4px",
  color: "white",
  flexWrap: "wrap",
  alignItems: "baseline",
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
