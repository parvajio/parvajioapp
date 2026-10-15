"use client";

import { useEffect, useRef, useState } from "react";
import {
  CircleUser,
  Mail,
  Menu,
  Moon,
  Package,
  Sun,
  X,
} from "lucide-react";
import { ACCENTS } from "@/data/profile";
import { setAccent, toggleTheme } from "@/lib/theme";
import type { WorkTab } from "./WorkShell";

type MobileNavProps = {
  curTab: WorkTab;
  onTab: (tab: WorkTab) => void;
};

const NAV_ITEMS: { id: WorkTab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "works", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function MobileNavIcon({ id }: { id: WorkTab }) {
  if (id === "profile") return <CircleUser size={20} aria-hidden="true" />;
  if (id === "works") return <Package size={20} aria-hidden="true" />;
  return <Mail size={20} aria-hidden="true" />;
}

/**
 * Step 8 mobile navbar (<720px only). Desktop renders nothing visible —
 * `.mnav` is `display:none` outside the mobile media query. Open state is
 * ephemeral (not persisted like the desktop `parva-nav` collapse).
 */
export default function MobileNav({ curTab, onTab }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Dismiss on outside click / Escape, trap Tab inside the panel, and
  // close when resizing up to desktop. All listeners removed on cleanup.
  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector<HTMLElement>("button.mnav-item")
      ?.focus();
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href]',
        ),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 720) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open ]);

  const select = (tab: WorkTab) => {
    onTab(tab);
    setOpen(false);
    // Panel unmounts, so return focus explicitly (no timeout to clean up).
    btnRef.current?.focus();
  };

  return (
    <div className="mnav" ref={rootRef}>
      <div className="mnav-bar">
        <button
          ref={btnRef}
          type="button"
          className="icon-btn mnav-menu"
          aria-expanded={open}
          aria-controls="mnav-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
        <span className="mnav-spacer" aria-hidden="true" />
        <button
          type="button"
          className="theme-toggle mnav-theme"
          onClick={toggleTheme}
          aria-label="Toggle light/dark theme"
        >
          <Moon className="tg-moon" size={18} aria-hidden="true" />
          <Sun className="tg-sun" size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="btn-cta mnav-cta"
          onClick={() => select("contact")}
        >
          Contact
        </button>
      </div>
      {open && (
        <nav
          ref={panelRef}
          id="mnav-panel"
          className="mnav-panel"
          aria-label="Site"
        >
          <ul className="mnav-list">
            {NAV_ITEMS.map((item) => {
              const active = curTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={
                      active ? "nav-item mnav-item active" : "nav-item mnav-item"
                    }
                    aria-current={active ? "page" : undefined}
                    onClick={() => select(item.id)}
                  >
                    <MobileNavIcon id={item.id} />
                    <b>{item.label}</b>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mnav-color">
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
        </nav>
      )}
    </div>
  );
}
