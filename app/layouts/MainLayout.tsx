import type { FC, ReactNode } from "react";
import { css } from "styled-system/css";
import { hstack, vstack } from "styled-system/patterns";

const root = vstack({
  paddingX: 48,
  paddingY: 36,
  gap: 60,
  alignItems: "start",
});

const header = hstack({
  width: "100%",
  justifyContent: "space-between",
  paddingY: 12,
});

const logo = vstack({
  alignItems: "start",
  gap: 0,
});

const logoServiceName = css({
  fontSize: "36px",
  color: "brand.background",
  fontWeight: "bold",
  lineHeight: "short",
  fontFeatureSettings: "'ss03' on",
});

const logoServiceType = css({
  fontSize: "16px",
  color: "brand.background",
  fontWeight: "bold",
  lineHeight: "short",
});

const pastelBiota = css({
  fontSize: "xs",
  color: "brand.primary",
});

type Props = {
  children: ReactNode;
};

export const MainLayout: FC<Props> = ({ children }) => {
  return (
    <div className={root}>
      <header className={header}>
        <hgroup className={logo}>
          <h1 className={logoServiceName}>Iris</h1>
          <p className={logoServiceType}>Photobook</p>
        </hgroup>
        <p className={pastelBiota}>Part of the pastel biota</p>
      </header>
      {children}
    </div>
  );
};
