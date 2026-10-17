import { ArrowUp } from "lucide-react";

type ScrollRingProps = {
  /** Accumulated scroll effort 0–1. */
  progress: number;
  /** Whether the floating ring is currently shown. */
  visible: boolean;
};

/** Floating hard-scroll-back cue. Uses the mobile pull-cue pill design on
 *  desktop instead of the original ring. Positioning + show/hide still
 *  come from .scroll-progress. */
export default function ScrollRing({ progress, visible }: ScrollRingProps) {
  return (
    <div
      className={`scroll-progress${visible ? " show" : ""}`}
      id="scrollProgress"
      aria-hidden="true"
      style={{
        background: "color-mix(in srgb, var(--surface) 88%, transparent)",
        border: "1px solid var(--line)",
        borderRadius: "999px",
        padding: "6px 12px 6px 8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 8px 30px var(--glow)",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "var(--primary)",
          color: "var(--on-primary)",
        }}
      >
        <ArrowUp size={14} aria-hidden="true" />
      </span>
      <span
        style={{
          display: "block",
          width: "64px",
          height: "2px",
          borderRadius: "2px",
          background: "var(--line)",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            background: "var(--primary)",
            borderRadius: "2px",
            transform: `scaleX(${progress.toFixed(3)})`,
            transformOrigin: "left center",
          }}
        />
      </span>
    </div>
  );
}
