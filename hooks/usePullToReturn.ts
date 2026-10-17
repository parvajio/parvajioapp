import { useEffect, useState, type RefObject } from "react";

/** Raw finger travel (px) needed to trip the return-to-hero. */
export const PULL_THRESHOLD = 96;
/** Visual follow rate: the cue translates at half the finger travel. */
export const PULL_RESISTANCE = 0.5;

export type PullToReturn = {
  /** Clamped raw pull distance 0–96 (drives progress). */
  pullPx: number;
  /** Pull effort 0–1 (drives the fill bar). */
  progress: number;
  /** Whether a pull gesture is currently active. */
  pulling: boolean;
};

/**
 * Step 8e mobile (<720px) pull-to-return. When #work is pinned and .col-main
 * is at scrollTop 0, a downward touch drag is absorbed (preventDefault on a
 * non-passive touchmove listener, only while at the top and dragging down)
 * and converted into pull progress. On touchend past the 96px threshold the
 * caller's goHero fires (smooth scroll to #hero); below it the state resets
 * with no scroll. Dragging up or scrolling from scrollTop > 0 is never
 * intercepted. All listeners are cleaned up. SSR-safe: initial zeros and
 * every window access happens inside the effect or event callbacks.
 */
export function usePullToReturn(
  mainRef: RefObject<HTMLElement | null>,
  workActive: boolean,
  goHero: () => void,
): PullToReturn {
  const [pullPx, setPullPx] = useState(0);
  const [pulling, setPulling] = useState(false);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    let startY: number | null = null;
    let armed = false;

    const isMobile = () =>
      window.matchMedia("(max-width: 720px)").matches;

    const disarm = () => {
      startY = null;
      if (armed) {
        armed = false;
        setPulling(false);
        setPullPx(0);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      // Multi-touch (pinch-zoom) never starts a pull.
      if (e.touches.length > 1) {
        disarm();
        return;
      }
      if (!isMobile() || !workActive) return;
      if (main.scrollTop > 0) return;
      startY = e.touches[0].clientY;
      armed = true;
      setPulling(true);
      setPullPx(0);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!armed || startY === null) return;
      if (e.touches.length > 1) {
        disarm();
        return;
      }
      if (!isMobile()) {
        disarm();
        return;
      }
      const dy = e.touches[0].clientY - startY;
      // Dragging up scrolls content normally — never intercept.
      if (dy <= 0) {
        disarm();
        return;
      }
      // Content scrolled off the top mid-gesture — hand back to the scroller.
      if (main.scrollTop > 0) {
        disarm();
        return;
      }
      // Active pull only: absorb the drag so it can't chain to the page,
      // trigger Android pull-to-refresh, or rubber-band on iOS.
      if (e.cancelable) e.preventDefault();
      setPullPx(Math.min(dy, PULL_THRESHOLD + 48));
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!armed || startY === null) return;
      const endY =
        e.changedTouches.length > 0
          ? e.changedTouches[0].clientY
          : startY;
      const dy = endY - startY;
      const tripped = dy >= PULL_THRESHOLD;
      startY = null;
      armed = false;
      setPulling(false);
      setPullPx(0);
      if (tripped) goHero();
    };

    const onTouchCancel = () => {
      startY = null;
      if (!armed) return;
      armed = false;
      setPulling(false);
      setPullPx(0);
    };

    main.addEventListener("touchstart", onTouchStart, { passive: true });
    // Needs { passive: false } for preventDefault() while pulling.
    main.addEventListener("touchmove", onTouchMove, { passive: false });
    main.addEventListener("touchend", onTouchEnd);
    main.addEventListener("touchcancel", onTouchCancel);
    return () => {
      main.removeEventListener("touchstart", onTouchStart);
      main.removeEventListener("touchmove", onTouchMove);
      main.removeEventListener("touchend", onTouchEnd);
      main.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [mainRef, workActive, goHero]);

  const progress = Math.min(1, pullPx / PULL_THRESHOLD);

  return { pullPx, progress, pulling };
}
