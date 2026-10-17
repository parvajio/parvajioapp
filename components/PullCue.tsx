"use client";

import { ArrowUp } from "lucide-react";
import { PULL_RESISTANCE, PULL_THRESHOLD } from "@/hooks/usePullToReturn";

type PullCueProps = {
  /** Clamped raw pull distance (drives the drop + fill). */
  pullPx: number;
  /** Pull effort 0–1 (drives the fill bar). */
  progress: number;
  /** Whether a pull gesture is currently active. */
  pulling: boolean;
};

/**
 * Step 8e mobile (<720px) pull-to-return cue. A small pill under the mobile
 * navbar that drops at half the finger rate and fills toward the 96px trip
 * point. Hidden on desktop by CSS (`.pull-cue` is `display:none` outside the
 * mobile media query). The wheel ScrollRing is untouched — this is a lighter,
 * touch-only companion driven by usePullToReturn.
 */
export default function PullCue({ pullPx, progress, pulling }: PullCueProps) {
  const drop = Math.min(pullPx, PULL_THRESHOLD) * PULL_RESISTANCE;
  return (
    <div
      className="pull-cue"
      aria-hidden="true"
      data-pulling={pulling ? "true" : "false"}
      style={{
        opacity: pulling || progress > 0 ? 1 : 0,
        transform: `translateX(-50%) translateY(${drop.toFixed(1)}px)`,
        transition: pulling ? "none" : undefined,
      }}
    >
      <span className="pull-cue-icon">
        <ArrowUp size={14} aria-hidden="true" />
      </span>
      <span className="pull-cue-track">
        <span
          className="pull-cue-fill"
          style={{ transform: `scaleX(${progress.toFixed(3)})` }}
        />
      </span>
    </div>
  );
}
