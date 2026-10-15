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
 * this inside showTab()). Passive scroll listener, cleaned up on unmount
 * and whenever the tab changes.
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
    return () => main.removeEventListener("scroll", onScroll);
  }, [mainRef, curTab]);

  return { sections, activeIdx, progress, scrolled, showId, scrollToSec };
}
