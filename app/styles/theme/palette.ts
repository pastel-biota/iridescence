import { formatCSS, type LCH } from "colorizr";

export const SHADES = 10;
export const BRIGHT = 5;

export const SHADES_LABEL = [
  "plume",
  "orange",
  "maple",
  "olive",
  "lime",
  "grass",
  "sky",
  "nemophila",
  "hydrangea",
  "rose",
];

export const SHADOWS_LABEL = [
  "light",
  "primary",
  "background",
  "identity",
  "reading",
];

export const SHADOWS = [
  [0.8443, 0.1004], // light
  [0.7739, 0.15], // primary
  [0.6409, 0.1447], // bg
  [0.5405, 0.1042], // fg
  [0.3302, 0.0526], // text
] as const;

export function generateColorPalette(): [string, [string, string][]][] {
  return SHADES_LABEL.map(
    (shade, shadeIndex) =>
      [
        shade,
        SHADOWS_LABEL.map(
          (shadow, shadowIndex) =>
            [
              shadow,
              formatCSS(generateOklch(shadeIndex, shadowIndex), {
                format: "oklch",
              }),
            ] as const,
        ),
      ] as const,
  );
}

export function generateOklch(hueIndex: number, shadowIndex: number): LCH {
  const shadow = SHADOWS[shadowIndex];
  if (shadow === undefined) {
    throw new TypeError(`Shadow index is out of range: ${String(shadowIndex)}`);
  }
  const [luminescence, chroma] = shadow;

  let hue = -4.28 + (hueIndex / SHADES) * 360;

  if (hue < 0) {
    hue += 360;
  }

  const model: LCH = { l: luminescence, c: chroma, h: hue };

  return model;
}
