import { useMatch, useViewTransitionState } from "react-router";

export function useViewTransitionFlags(targetPage: string) {
  const isOnTargetPage = useMatch(targetPage);
  const transitioning = useViewTransitionState(targetPage);

  if (!transitioning) {
    return { onPage: false, offPage: false };
  }

  return {
    onPage: isOnTargetPage != null,
    offPage: isOnTargetPage == null,
  };
}
