"use client";

import { useEffect, useRef, useState } from "react";

export default function Shutter() {
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState(false);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Single invite peek — one orchestrated moment, no loop (respects reduced-motion).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let unpeek: number | undefined;
    const invite = window.setTimeout(() => {
      if (openRef.current) return;
      setPeek(true);
      unpeek = window.setTimeout(() => setPeek(false), 650);
    }, 1200);
    return () => {
      window.clearTimeout(invite);
      if (unpeek !== undefined) window.clearTimeout(unpeek);
    };
  }, []);

  const className =
    "shutter-wrap" + (open ? " open" : "") + (peek ? " peek" : "");

  return (
    <button
      type="button"
      className={className}
      title="Tap to split"
      aria-expanded={open ? "true" : "false"}
      aria-label="Job title — activate to reveal Problem Solver"
      onClick={() => setOpen((v) => !v)}
    >
      <span className="shutter" aria-hidden={false}>
        <span className="reveal">
          <span className="s1">Problem</span>
          <span className="s2">SOLVER</span>
        </span>
        <span className="half left" aria-hidden="true">
          <span>DEVELOPER</span>
        </span>
        <span className="half right" aria-hidden="true">
          <span>DEVELOPER</span>
        </span>
      </span>
    </button>
  );
}
