"use client";

import { ArrowUpRight } from "lucide-react";
import { CTX_STATIC, RAIL_LINKS, type RailIcon } from "@/data/profile";
import { WORKS } from "@/data/works";
import type { WorkTab } from "./WorkShell";
import DhakaClock from "./DhakaClock";

type RightRailProps = {
  curTab: WorkTab;
  sections: string[];
  activeIdx: number;
  /** Hovered project card index — null when no card is hovered. */
  hoverIdx: number | null;
  /** Reading progress 0–1. */
  progress: number;
  onSelect: (index: number) => void;
};

/** Brand glyphs have no lucide-react match in this version, so the two
 *  original inline SVGs are kept verbatim (allowed by the icons rule). */
function RailLinkIcon({ icon }: { icon: RailIcon }) {
  if (typeof icon === "string") return <BrandIcon name={icon} />;
  const Icon = icon;
  return <Icon aria-hidden="true" />;
}

/** Brand glyphs have no lucide-react match in this version, so the two
 *  original inline SVGs are kept verbatim (allowed by the icons rule). */
function BrandIcon({ name }: { name: "github" | "linkedin" }) {
  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function RightRail({
  curTab,
  sections,
  activeIdx,
  hoverIdx,
  progress,
  onSelect,
}: RightRailProps) {
  const ctx = curTab === "contact" ? CTX_STATIC.contact : CTX_STATIC.profile;
  // Projects variant: hover wins (PREVIEW), otherwise the scroll-spy index
  // (IN VIEW) — ports renderContext() from old/index.html. Clamped so a
  // stale activeIdx during tab switch can't index past the array.
  const workIdx =
    curTab === "works"
      ? Math.min(hoverIdx ?? activeIdx, WORKS.length - 1)
      : 0;
  const work = WORKS[workIdx];
  const pct = Math.round(progress * 100);

  return (
    <aside className="col-info">
      <div className="rail">
        <div className="rail-block">
          <div className="rail-h">
            <span>ON THIS PAGE</span>
            <span id="readPct">{pct}%</span>
          </div>
          <ul className="toc" id="toc">
            {sections.map((label, i) => (
              <li key={`${label}-${i}`}>
                <a
                  data-i={i}
                  role="button"
                  tabIndex={0}
                  className={i === activeIdx ? "active" : undefined}
                  onClick={() => onSelect(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelect(i);
                    }
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="progress">
            <i id="readBar" style={{ width: `${pct}%` }}></i>
          </div>
        </div>
        <div className="rail-block">
          <div className="rail-h">
            <span>LOCAL TIME</span>
          </div>
          <DhakaClock variant="rail" />
        </div>
        <div className="rail-block" id="railContext">
          {curTab === "works" ? (
            <>
              <div className="rail-h">
                <span>
                  PROJECT {String(workIdx + 1).padStart(2, "0")}
                </span>
                <span>{hoverIdx !== null ? "PREVIEW" : "IN VIEW"}</span>
              </div>
              <div className="ctx-title">{work.t}</div>
              <p className="ctx-p">{work.d}</p>
              <div className="kv">
                <span>Stack</span>
                <b>{work.s}</b>
              </div>
              <div className="kv">
                <span>Role</span>
                <b>{work.r}</b>
              </div>
            </>
          ) : (
            <>
              <div className="rail-h">
                <span>{ctx.heading}</span>
              </div>
              {ctx.rows.map((row) => (
                <div key={row.k} className="kv">
                  <span>{row.k}</span>
                  <b>{row.v}</b>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="rail-block">
          <div className="rail-h">
            <span>LINKS</span>
          </div>
          {RAIL_LINKS.map((link) => {
            const placeholder = link.href === "#";
            return (
              <a
                key={link.label}
                className="rail-link"
                href={link.href}
                onClick={
                  placeholder ? (e) => e.preventDefault() : undefined
                }
              >
                <RailLinkIcon icon={link.icon} />
                {link.label}
                <ArrowUpRight className="go" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
