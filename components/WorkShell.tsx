"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useHardScrollBack } from "@/hooks/useHardScrollBack";
import { usePullToReturn } from "@/hooks/usePullToReturn";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useWorkPin } from "@/hooks/useWorkPin";
import ContactTab from "./ContactTab";
import MobileNav from "./MobileNav";
import PageBar from "./PageBar";
import ProfileTab from "./ProfileTab";
import ProjectsTab from "./ProjectsTab";
import PullCue from "./PullCue";
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
    mainRef.current?.scrollTo({ top: 0 });
  }, []);

  const spy = useScrollSpy(mainRef, curTab);
  const hard = useHardScrollBack();
  // Mobile-only pin: .col-main stays locked until #work reaches the top.
  // Re-evaluated per tab since tab switches change the content height.
  const workActive = useWorkPin(workRef, curTab);
  // Mobile-only pull-to-return: a deliberate downward pull at the top of
  // .col-main (while pinned) trips the same goHero flight as the ring/up
  // button. Desktop and the wheel ring are unaffected — this hook owns
  // separate touch-only progress state.
  const pull = usePullToReturn(mainRef, workActive, hard.goHero);

  // Up-button path is hard.goHero directly: the mobile inner reset
  // (so re-entry starts at the top) lives inside the hook so the ring
  // trip and the button share one trip. Desktop passes straight through
  // to the hard-scroll-back trip.

  return (
    <>
      <section
        id="work"
        ref={workRef}
        data-active={workActive ? "true" : "false"}
        className={collapsed ? "nav-collapsed" : undefined}
      >
        <MobileNav curTab={curTab} onTab={showTab} />
        <PullCue pullPx={pull.pullPx} progress={pull.progress} pulling={pull.pulling} />
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
      <ScrollRing progress={hard.progress} visible={hard.visible} />
    </>
  );
}
