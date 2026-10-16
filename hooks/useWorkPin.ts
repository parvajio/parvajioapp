import { useEffect, useState, type RefObject } from "react";

/** Pinned when #work top is within this distance of the viewport top. */
const ENTER_PX = 4;
/** Unpin only once #work drifts this far off the top (toolbar jitter guard). */
const EXIT_PX = 64;

/**
 * Mobile-only (<720px) pin state for #work. True once #work's top edge
 * reaches the top of the viewport; false otherwise (including all
 * desktop widths). Scroll-driven rather than IntersectionObserver-based:
 * #work is at least viewport-tall so an intersection ratio is
 * meaningless, and IO doesn't fire while a sentinel stays intersecting
 * during a half-visible → pinned scroll.
 *
 * The enter edge is gated on the touch state: if the pin point is
 * crossed while a finger is still down, the flip is held until touchend
 * plus one settled frame. Flipping overflow mid-touch lets Safari hand
 * the live gesture to the newly-scrollable inner column, so content
 * starts scrolling before the page visually settles. The exit edge
 * stays immediate (locking mid-touch is always safe). All listeners,
 * the media-query subscription, the visualViewport subscription and any
 * pending frame are cleaned up. SSR-safe: initial `false` matches the
 * server render, measurement starts after mount.
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
    // True while any finger is down on the window. Fresh per effect run
    // so a tab-switch re-subscribe can never inherit a stuck-true flag.
    let touching = false;

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
      // Exit is immediate, even mid-touch. Enter waits for the touch to
      // lift: the touchend handler below re-schedules, so this runs again
      // one settled frame after release.
      if (!cur && top <= ENTER_PX) {
        if (!touching) apply(true);
      } else if (cur && top > EXIT_PX) apply(false);
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(measure);
    };

    const onTouchStart = () => {
      touching = true;
    };

    const onTouchEnd = (e: TouchEvent) => {
      // One finger lifting during multi-touch keeps the gate closed.
      if (e.touches.length > 0) return;
      touching = false;
      schedule();
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    // iOS Safari doesn't fire window resize when the address bar shows
    // or collapses (100dvh shifts under the gesture) — visualViewport
    // does. Absent on older browsers, hence the guard.
    const vv = window.visualViewport;
    vv?.addEventListener("resize", schedule);
    mq.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      vv?.removeEventListener("resize", schedule);
      mq.removeEventListener("change", schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [workRef, resetKey]);

  return active;
}
