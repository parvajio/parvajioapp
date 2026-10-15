"use client";

import { useEffect, useState } from "react";
import { ACCENTS } from "@/data/profile";
import { setAccent, toggleTheme } from "@/lib/theme";
import type { WorkTab } from "./WorkShell";

type SidebarProps = {
  curTab: WorkTab;
  onTab: (tab: WorkTab) => void;
  collapsed: boolean;
  onToggleNav: () => void;
};

const NAV_ITEMS: { id: WorkTab; label: string; title: string }[] = [
  { id: "profile", label: "Profile", title: "Profile" },
  { id: "works", label: "Projects", title: "Projects" },
  { id: "contact", label: "Contact", title: "Contact" },
];

function NavIcon({ id }: { id: WorkTab }) {
  if (id === "profile") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
      </svg>
    );
  }
  if (id === "works") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function Sidebar({
  curTab,
  onTab,
  collapsed,
  onToggleNav,
}: SidebarProps) {
  // Matches old/index.html: static 2026 in markup, corrected at runtime.
  // Read after mount so the SSR year never mismatches hydration.
  const [year, setYear] = useState(2026);
  useEffect(() => {
    const t = window.setTimeout(
      () => setYear(new Date().getFullYear()),
      0,
    );
    return () => window.clearTimeout(t);
  }, []);

  return (
    <aside className="col-nav">
      <button
        type="button"
        className="nav-toggle"
        id="navToggle"
        onClick={onToggleNav}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={collapsed ? "false" : "true"}
        aria-controls="workNav"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div className="work-brand">
        <div className="work-avatar">P</div>
        <div className="brand-text">
          parvajio<span>.dev</span>
        </div>
      </div>
      <nav className="nav-links" id="workNav" aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const active = curTab === item.id;
          return (
            <div
              key={item.id}
              className={active ? "nav-item active" : "nav-item"}
              data-tab={item.id}
              title={item.title}
              role="button"
              tabIndex={0}
              aria-current={active ? "page" : undefined}
              onClick={() => onTab(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onTab(item.id);
                }
              }}
            >
              <NavIcon id={item.id} />
              <b>{item.label}</b>
            </div>
          );
        })}
      </nav>
      <div className="nav-divider" role="separator"></div>
      <div className="side-ctl">
        <div className="side-row">
          <span className="side-label">THEME</span>
          <button
            type="button"
            className="theme-toggle side-theme"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
          >
            <svg className="tg-moon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
            </svg>
            <svg className="tg-sun" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l-1.4-1.4" />
            </svg>
          </button>
        </div>
        <div className="side-row">
          <span className="side-label">COLOR</span>
          <div className="side-swatches">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                className="swatch"
                data-accent={a.id}
                style={{ background: a.gradient }}
                aria-label={a.label}
                onClick={() => setAccent(a.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mini-profile">
        <div className="avatar">P</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            MD. Parvaj Mosharof
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
            DHAKA • UTC+6
          </div>
        </div>
      </div>
      <div className="copyright">
        <span className="cr-full">
          © <span className="cr-year">{year}</span> MD. Parvaj Mosharof
        </span>
        <span className="cr-short">
          © <span className="cr-year">{year}</span>
        </span>
      </div>
    </aside>
  );
}
