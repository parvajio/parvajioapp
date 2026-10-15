import { useCallback, useEffect, useRef, useState } from "react";

/** Accumulated upward wheel delta needed to trigger the trip back to hero. */
const NEED = 1400;
/** How long the floating ring stays visible per wheel tick. */
const FLASH_MS = 700;
/** Fallback snap-restore if the arrival scroll event never fires
 *  (interrupted trip). Generous on purpose: the arrival listener below
 *  removes no-snap early on success, so this only fires when the flight
 *  never completes — it must not cut a slow flight short. */
const SNAP_FALLBACK_MS = 2000;

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
  const snapRef = useRef<number | undefined>(undefined);
  // Set once the 100% trip fires, so further wheel ticks during the
  // smooth scroll home can't re-fill the ring. Cleared on arrival
  // (scrollY < 20), when steering back down (interrupted trip), or when
  // scrolling back down into #work.
  const lockedRef = useRef(false);
  // Last page Y for the scroll-direction abort below. Ref (not state) so
  // the scroll listener never re-subscribes; no timer, nothing to clean.
  const lastYRef = useRef(0);

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

  // Mobile-only (<=720px) snap parking, shared by the ring trip and the
  // up button (both call goHero). Parks scroll-snap during the smooth
  // flight home — otherwise mandatory snap can trap it mid-way — and
  // resets the inner column so re-entry starts at the top. Desktop is
  // untouched: early return, no class, no timer.
  const parkSnapMobile = useCallback(() => {
    if (!window.matchMedia("(max-width: 720px)").matches) return;
    document.documentElement.classList.add("no-snap");
    document.getElementById("mainCol")?.scrollTo({ top: 0 });
    window.clearTimeout(snapRef.current);
    snapRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove("no-snap");
    }, SNAP_FALLBACK_MS);
  }, []);

  const goHero = useCallback(() => {
    parkSnapMobile();
    window.scrollTo({ top: 0, behavior: "smooth" });
    resetHard();
    lockedRef.current = true;
  }, [parkSnapMobile, resetHard]);

  const enterWork = useCallback(() => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Reset once back in the hero (original: scrollY < 20) — arrival also
  // unlocks the ring for the next visit and restores snap parked for the
  // mobile trip (the fallback timer above only matters if arrival never
  // fires, e.g. an interrupted flight). Steering back down (Y increasing)
  // also unlocks: an interrupted goHero flight otherwise leaves the lock
  // stranded mid-page, since neither the <20 arrival nor the deep
  // workTop+120 re-entry ever fires.
  useEffect(() => {
    lastYRef.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 20) {
        lockedRef.current = false;
        resetHard();
        if (document.documentElement.classList.contains("no-snap")) {
          document.documentElement.classList.remove("no-snap");
          window.clearTimeout(snapRef.current);
        }
      } else if (lockedRef.current && y > lastYRef.current + 4) {
        lockedRef.current = false;
      }
      lastYRef.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [resetHard]);

  // Upward wheel near the top of #work accumulates toward NEED. Only
  // hijacked when the inner column is already at its top (or the wheel
  // isn't over a scrollable column) — otherwise the page scrolls
  // naturally. Needs { passive: false } for preventDefault().
  // Desktop (721px+): the band extends upward to where #work covers half
  // the viewport, so a half-parked page still drives the ring. Mobile is
  // untouched (original -40px band) to preserve the snap/pin behavior.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const work = document.getElementById("work");
      if (!work) return;
      const workTop = work.offsetTop;
      // Scrolled back down into #work — a fresh attempt may start.
      if (window.scrollY > workTop + 120) lockedRef.current = false;
      // Steering back down aborts an in-flight goHero trip (covers the
      // gap before the scroll listener observes the Y increase).
      if (e.deltaY > 0) {
        if (lockedRef.current) lockedRef.current = false;
        return;
      }
      if (lockedRef.current) return;
      const isDesktop = window.matchMedia("(min-width: 721px)").matches;
      const lower = isDesktop
        ? workTop - window.innerHeight * 0.5
        : workTop - 40;
      const nearTop =
        window.scrollY >= lower && window.scrollY <= workTop + 120;
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

  // Clear any pending flash-hide / snap-restore timeouts on unmount.
  useEffect(
    () => () => {
      window.clearTimeout(hideRef.current);
      window.clearTimeout(snapRef.current);
    },
    [],
  );

  return { progress, visible, goHero, enterWork };
}
