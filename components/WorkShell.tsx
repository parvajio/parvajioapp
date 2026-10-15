"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import ContactTab from "./ContactTab";
import PageBar from "./PageBar";
import ProfileTab from "./ProfileTab";
import ProjectsTab from "./ProjectsTab";
import RightRail from "./RightRail";
import Sidebar from "./Sidebar";

export type WorkTab = "profile" | "works" | "contact";

const NAV_KEY = "parva-nav";

export default function WorkShell() {
  const [curTab, setCurTab] = useState<WorkTab>("profile");
  const [collapsed, setCollapsed] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

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
    mainRef.current?.scrollTo({ top: 0 });
  }, []);

  const spy = useScrollSpy(mainRef, curTab);

  return (
    <section id="work" className={collapsed ? "nav-collapsed" : undefined}>
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
          {curTab === "works" && <ProjectsTab />}
          {curTab === "contact" && <ContactTab />}
        </main>
        <RightRail
          curTab={curTab}
          sections={spy.sections}
          activeIdx={spy.activeIdx}
          progress={spy.progress}
          onSelect={spy.scrollToSec}
        />
      </div>
    </section>
  );
}
