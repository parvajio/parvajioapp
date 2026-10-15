import { useCallback, useEffect, useRef, useState } from "react";

/** Accumulated upward wheel delta needed to trigger the trip back to hero. */
const NEED = 1400;
/** How long the floating ring stays visible per wheel tick. */
const FLASH_MS = 700;

export type HardScrollBack = {
  /** Accumulated scroll effort 0–1 (drives the ring). */
  progress: number;
  /** Whether the floating ring is currently shown. */
  visible: boolean;
  /** Smooth-scroll to the top (hero) and reset the ring. */
  goHero: () => void;
  /** Smooth-scroll down to #work. */
  enterWork: () => void;
};

/**
 * Ports the hard-scroll-back logic from old/index.html (acc/NEED ring,
 * resetHard, flashShow, window scroll + wheel listeners, Enter keydown).
 * All listeners and timeouts are cleaned up on unmount. SSR-safe: the
 * first render is progress 0 / hidden and every window/document access
 * happens inside effects or event callbacks.
 */
export function useHardScrollBack(): HardScrollBack {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const accRef = useRef(0);
  const hideRef = useRef<number | undefined>(undefined);
  // Set once the 100% trip fires, so further wheel ticks during the
  // smooth scroll home can't re-fill the ring. Cleared on arrival
  // (scrollY < 20) or when scrolling back down into #work.
  const lockedRef = useRef(false);

  const resetHard = useCallback(() => {
    accRef.current = 0;
    setProgress(0);
    setVisible(false);
    window.clearTimeout(hideRef.current);
  }, []);

  const flashShow = useCallback(() => {
    setVisible(true);
    window.clearTimeout(hideRef.current);
    hideRef.current = window.setTimeout(
      () => setVisible(false),
      FLASH_MS,
    );
  }, []);

  const goHero = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    resetHard();
    lockedRef.current = true;
  }, [resetHard]);

  const enterWork = useCallback(() => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Reset once back in the hero (original: scrollY < 20) — arrival also
  // unlocks the ring for the next visit.
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 20) {
        lockedRef.current = false;
        resetHard();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [resetHard]);

  // Upward wheel near the top of #work accumulates toward NEED. Only
  // hijacked when the inner column is already at its top (or the wheel
  // isn't over a scrollable column) — otherwise the page scrolls
  // naturally. Needs { passive: false } for preventDefault().
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const work = document.getElementById("work");
      if (!work) return;
      const workTop = work.offsetTop;
      // Scrolled back down into #work — a fresh attempt may start.
      if (window.scrollY > workTop + 120) lockedRef.current = false;
      if (lockedRef.current) return;
      const nearTop =
        window.scrollY >= workTop - 40 && window.scrollY <= workTop + 120;
      const target = e.target as Element | null;
      const sc = target?.closest?.(".col-main,.col-info");
      const atTop = !sc || sc.scrollTop <= 0;
      if (nearTop && e.deltaY < 0 && atTop) {
        e.preventDefault();
        accRef.current += Math.abs(e.deltaY);
        const p = Math.min(1, accRef.current / NEED);
        setProgress(p);
        if (p > 0 && p < 1) flashShow();
        if (p >= 1) goHero();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [flashShow, goHero]);

  // Enter (outside the shutter, in the top half of the viewport) enters #work.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const target = e.target as Element | null;
      if (target?.closest?.(".shutter-wrap")) return;
      if (window.scrollY < window.innerHeight / 2) enterWork();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [enterWork]);

  // Clear any pending flash-hide timeout on unmount.
  useEffect(() => () => window.clearTimeout(hideRef.current), []);

  return { progress, visible, goHero, enterWork };
}
