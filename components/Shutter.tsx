"use client";

import { useEffect, useRef, useState } from "react";

export default function Shutter() {
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState(false);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Scroll perf: while the page moves, freeze the infinite .feat sheen
  // (html.is-scrolling → animation-play-state:paused in globals.css).
  // Mobile Safari repaints background-clip:text on the CPU every frame,
  // which drops scroll frames in the hero where all three sheens run.
  // Passive listener, idle timer cleared on re-fire and unmount.
  useEffect(() => {
    let idle: number | undefined;
    const onScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
      document.documentElement.classList.remove("is-scrolling");
    };
  }, []);
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
