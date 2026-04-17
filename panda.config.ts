import { defineConfig } from "@pandacss/dev";

import { colorTokens, semanticColorToken } from "~/styles/theme/color";
import {
  fontFamily,
  fontSizes,
  fontWeights,
  lineHeights,
} from "~/styles/theme/font";
import { letterSpacings } from "~/styles/theme/letterSpacing";
import { viewKeyframes, viewTransitionStyles } from "~/styles/view-transition";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    tokens: {
      colors: colorTokens,
      fonts: fontFamily,
      fontSizes,
      fontWeights,
      lineHeights,
      letterSpacings,
    },
    semanticTokens: {
      colors: semanticColorToken,
    },
    keyframes: viewKeyframes,
  },

  globalCss: viewTransitionStyles,

  // The output directory for your css system
  outdir: "styled-system",
});
