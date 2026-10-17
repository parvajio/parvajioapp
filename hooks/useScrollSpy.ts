import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { WorkTab } from "@/components/WorkShell";

export type ScrollSpy = {
  /** data-toc labels of the current tab, in document order. */
  sections: string[];
  /** Index of the section currently in view. */
  activeIdx: number;
  /** Reading progress 0–1. */
  progress: number;
  /** True once scrolled more than 4px (page-bar bottom border). */
  scrolled: boolean;
  /** True on non-profile tabs, or past 230px on profile (bar identity). */
  showId: boolean;
  scrollToSec: (index: number) => void;
};

/**
 * Ports buildToc() + onScroll() + scrollToSec() from old/index.html.
 * The section list is rebuilt whenever curTab changes (the original did
 * this inside showTab()). Desktop-only (721px+): below 720px the window
 * is the only scroller and the TOC/progress aren't shown, so no scroll
 * listener is attached. A matchMedia subscription re-runs setup on
 * rotation across 720px; all listeners are cleaned up.
 */
export function useScrollSpy(
  mainRef: RefObject<HTMLElement | null>,
  curTab: WorkTab,
): ScrollSpy {
  const secsRef = useRef<HTMLElement[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showId, setShowId] = useState(curTab !== "profile");

  const scrollToSec = useCallback(
    (index: number) => {
      const main = mainRef.current;
      const el = secsRef.current[index];
      if (!main || !el) return;
      const top =
        el.getBoundingClientRect().top -
        main.getBoundingClientRect().top +
        main.scrollTop -
        84;
      main.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    },
    [mainRef],
  );

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const mq = window.matchMedia("(min-width: 721px)");
    let cleanupInner: (() => void) | undefined;

    const setup = () => {
      cleanupInner?.();
      cleanupInner = undefined;
      if (!mq.matches) {
        secsRef.current = [];
        setSections([]);
        setActiveIdx(0);
        setProgress(0);
        setScrolled(false);
        setShowId(curTab !== "profile");
        return;
      }
      const tabEl = main.querySelector(`#tab-${curTab}`);
      const secs = tabEl
        ? Array.from(tabEl.querySelectorAll<HTMLElement>("[data-toc]"))
        : [];
      secsRef.current = secs;
      setSections(secs.map((s) => s.dataset.toc ?? ""));

      const onScroll = () => {
        const st = main.scrollTop;
        const max = main.scrollHeight - main.clientHeight;
        const p = max > 0 ? Math.min(1, st / max) : 0;
        setProgress(p);
        const mt = main.getBoundingClientRect().top;
        let idx = 0;
        secs.forEach((s, i) => {
          if (s.getBoundingClientRect().top - mt <= 140) idx = i;
        });
        if (max > 0 && st >= max - 4) idx = secs.length - 1;
        setActiveIdx(idx);
        setScrolled(st > 4);
        setShowId(curTab !== "profile" || st > 230);
      };

      onScroll();
      main.addEventListener("scroll", onScroll, { passive: true });
      cleanupInner = () => main.removeEventListener("scroll", onScroll);
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      cleanupInner?.();
    };
  }, [mainRef, curTab]);

  return { sections, activeIdx, progress, scrolled, showId, scrollToSec };
}
