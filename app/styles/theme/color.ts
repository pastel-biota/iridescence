import type { SemanticTokens, Tokens } from "@pandacss/dev";
import type { Token } from "styled-system/types/composition";

import { generateColorPalette } from "./palette";

function tokens(): Record<string, Record<string, Token<string>>> {
  const biotaPalette = generateColorPalette();

  const tokens = Object.fromEntries(
    biotaPalette.map(([shade, shadows]) => [
      shade,
      Object.fromEntries(
        shadows.map(([shadow, color]) => [shadow, { value: color }]),
      ),
    ]),
  );

  return tokens;
}

export const colorTokens: Tokens["colors"] = {
  ...tokens(),
};

export const semanticColorToken: SemanticTokens["colors"] = {
  brand: {
    light: { value: "{colors.nemophila.light}" },
    primary: { value: "{colors.nemophila.primary}" },
    background: { value: "{colors.nemophila.background}" },
    identity: { value: "{colors.nemophila.identity}" },
    reading: { value: "{colors.nemophila.reading}" },
  },
};
