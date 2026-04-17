import { defineGlobalStyles, defineKeyframes } from "@pandacss/dev";

import { TILE_VIEW_TRANSITION_NAME } from "~/features/tile/style";
export const viewTransitionStyles = defineGlobalStyles({
  [`::view-transition-image-pair(${TILE_VIEW_TRANSITION_NAME})`]: {
    isolation: "auto",
  },
  [`::view-transition-old(${TILE_VIEW_TRANSITION_NAME})`]: {
    animation: "vt-fade-out 200ms cubic-bezier(.61,.39,.1,.96) both",
    // animation: 'vt-fade-out 200ms ease-in-out both',
  },
  [`::view-transition-new(${TILE_VIEW_TRANSITION_NAME})`]: {
    animation: "vt-fade-in 200ms cubic-bezier(.04,.81,.12,.95) both",
    // animation: 'vt-fade-in 200ms ease-in-out both',
  },
  [`::view-transition-group(${TILE_VIEW_TRANSITION_NAME})`]: {
    animationDuration: "200ms",
  },
});

export const viewKeyframes = defineKeyframes({
  "vt-fade-out": {
    "0%": { opacity: 1 },
    "60%": { opacity: 0 },
    "100%": { opacity: 0 },
  },
  "vt-fade-in": {
    "0%": { opacity: 0 },
    "40%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
});
