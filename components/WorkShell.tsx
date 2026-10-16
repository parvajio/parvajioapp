"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useHardScrollBack } from "@/hooks/useHardScrollBack";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import ContactTab from "./ContactTab";
import MobileNav from "./MobileNav";
import PageBar from "./PageBar";
import ProfileTab from "./ProfileTab";
import ProjectsTab from "./ProjectsTab";
import RightRail from "./RightRail";
import ScrollRing from "./ScrollRing";
import Sidebar from "./Sidebar";

export type WorkTab = "profile" | "works" | "contact";

const NAV_KEY = "parva-nav";

export default function WorkShell() {
  const [curTab, setCurTab] = useState<WorkTab>("profile");
  const [collapsed, setCollapsed] = useState(false);
  // Hovered project card index — the original kept this in a `hoverIdx`
  // variable and re-rendered the rail context from it. The scroll-spy index
  // reset is handled by useScrollSpy rebuilding on curTab change (the
  // original did it inside showTab()).
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);

  // Persisted collapse is read after mount so SSR HTML always matches
  // the server (expanded) render — no hydration mismatch. Deferred to a
  // timeout so the effect itself stays a subscription-style sync.
  useEffect(() => {
    let stored = false;
    try {
      stored = localStorage.getItem(NAV_KEY) === "1";
    } catch {
      /* storage unavailable — stay expanded */
    }
    if (!stored) return;
    const t = window.setTimeout(() => setCollapsed(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  const toggleNav = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(NAV_KEY, next ? "1" : "0");
      } catch {
        /* storage unavailable — collapse still applies for this session */
      }
      return next;
    });
  }, []);

  const showTab = useCallback((tab: WorkTab) => {
    setCurTab(tab);
    setHoverIdx(null);
    // Desktop (721px+): the inner column is the scroller — reset it.
    // Mobile: the window is the only scroller. If #work's top is above
    // the viewport, align it under the viewport top instantly;
    // otherwise don't scroll. Evaluated at call time, no subscription.
    const isDesktop = window.matchMedia("(min-width: 721px)").matches;
    if (isDesktop) {
      mainRef.current?.scrollTo({ top: 0 });
      return;
    }
    const top = workRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      window.scrollTo({ top: top + window.scrollY, behavior: "auto" });
    }
  }, []);

  const spy = useScrollSpy(mainRef, curTab);
  const hard = useHardScrollBack();

  // Up button scrolls the window to the top (hero) on both widths.

  return (
    <>
      <section
        id="work"
        ref={workRef}
        className={collapsed ? "nav-collapsed" : undefined}
      >
        <MobileNav curTab={curTab} onTab={showTab} />
        <div className="cols">
          <Sidebar
            curTab={curTab}
            onTab={showTab}
            collapsed={collapsed}
            onToggleNav={toggleNav}
          />
          <main className="col-main" id="mainCol" ref={mainRef}>
            <PageBar
              onContact={() => showTab("contact")}
              showId={spy.showId}
              scrolled={spy.scrolled}
            />
            {curTab === "profile" && <ProfileTab />}
            {curTab === "works" && <ProjectsTab onHover={setHoverIdx} />}
            {curTab === "contact" && <ContactTab />}
          </main>
          <RightRail
            curTab={curTab}
            sections={spy.sections}
            activeIdx={spy.activeIdx}
            hoverIdx={hoverIdx}
            progress={spy.progress}
            onSelect={spy.scrollToSec}
          />
        </div>
      </section>
      <button
        type="button"
        className="up-btn"
        onClick={hard.goHero}
        aria-label="back to hero"
      >
        <ArrowUp size={20} aria-hidden="true" />
      </button>
      <ScrollRing progress={hard.progress} visible={hard.visible} />
    </>
  );
}
