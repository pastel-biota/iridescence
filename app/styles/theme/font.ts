import type { Tokens } from "@pandacss/dev";

export const fontFamily: Tokens["fonts"] = {
  en: { value: "Reddit Sans, Inter, Roboto, -system-ui, sans-serif" },
  metrics: { value: "Barlow, Inter, Roboto, -system-ui, sans-serif" },
  ja: {
    value:
      "BIZ UDPGothic, Noto Sans JP, Noto Sans CJK JP, Noto Sans, -system-ui, sans-serif",
  },
};

export const fontSizes: Tokens["fontSizes"] = {
  declare: { value: "48px" },
  hero: { value: "40px" },
  h1: { value: "32px" },
  md: { value: "20px" },
  sm: { value: "16px" },
  xs: { value: "12px" },
};

export const fontWeights: Tokens["fontWeights"] = {
  bold: { value: "700" },
  normal: { value: "400" },
};

export const lineHeights: Tokens["lineHeights"] = {
  long: { value: "130%" },
  none: { value: "100%" },
  short: { value: "85%" },
};
