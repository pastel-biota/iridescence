import { defineConfig } from "@pandacss/dev";

import { colorTokens, semanticColorToken } from "~/styles/theme/color";
import {
  fontFamily,
  fontSizes,
  fontWeights,
  lineHeights,
} from "~/styles/theme/font";

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
    },
    semanticTokens: {
      colors: semanticColorToken,
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
