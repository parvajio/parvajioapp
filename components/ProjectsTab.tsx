"use client";

import { ArrowUpRight } from "lucide-react";
import { WORKS } from "@/data/works";

type ProjectsTabProps = {
  onHover: (index: number | null) => void;
};

export default function ProjectsTab({ onHover }: ProjectsTabProps) {
  return (
    <div id="tab-works">
      <div className="page">
        <div className="page-head">
          <div className="kicker2">PROJECTS</div>
          <h1 className="page-title">Selected work.</h1>
          <p className="lead">
            Things I&apos;ve built. Hover a project and the panel on the right
            shows its stack and role.
          </p>
        </div>
        <div className="list" id="workCards">
          {WORKS.map((w, i) => (
            <div
              key={w.t}
              className="item"
              data-toc={w.t}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
            >
              <div className="item-num">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="item-body">
                <div className="item-title">{w.t}</div>
                <div className="item-desc">{w.d}</div>
                <div className="pills">
                  {w.tags.map((tag) => (
                    <span key={tag} className="pill-s">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="item-go">
                <ArrowUpRight aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
