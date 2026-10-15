import { useEffect, useState, type RefObject } from "react";

/** Pinned when #work top is within this distance of the viewport top. */
const ENTER_PX = 4;
/** Unpin only once #work drifts this far off the top (toolbar jitter guard). */
const EXIT_PX = 64;

/**
 * Mobile-only (<720px) pin state for #work. True once #work is fully
 * snapped to the top of the viewport; false otherwise (including all
 * desktop widths). Scroll-driven rather than IntersectionObserver-based:
 * #work is taller than the viewport so an intersection ratio is
 * meaningless, and IO doesn't fire while a sentinel stays intersecting
 * during a half-visible → pinned scroll. All listeners, the media-query
 * subscription and any pending frame are cleaned up. SSR-safe: initial
 * `false` matches the server render, measurement starts after mount.
 */
export function useWorkPin(
  workRef: RefObject<HTMLElement | null>,
  resetKey: string,
): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const work = workRef.current;
    if (!work) return;
    const mq = window.matchMedia("(max-width: 720px)");
    let raf = 0;
    let cur = false;

    const apply = (next: boolean) => {
      if (next === cur) return;
      cur = next;
      setActive(next);
    };

    const measure = () => {
      raf = 0;
      if (!mq.matches) {
        apply(false);
        return;
      }
      const top = work.getBoundingClientRect().top;
      if (!cur && top <= ENTER_PX) apply(true);
      else if (cur && top > EXIT_PX) apply(false);
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    mq.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      mq.removeEventListener("change", schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [workRef, resetKey]);

  return active;
}
