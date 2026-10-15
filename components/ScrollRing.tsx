/** Ring circumference (r=19 → 2πr≈119.4), copied from old/index.html. */
const CIRC = 119.4;

type ScrollRingProps = {
  /** Accumulated scroll effort 0–1. */
  progress: number;
  /** Whether the floating ring is currently shown. */
  visible: boolean;
};

/** Floating hard-scroll-back ring. Same #scrollProgress structure as
 *  old/index.html, but stripped of all chrome per design request: no
 *  bubble (background/border/shadow neutralized inline so globals.css
 *  stays verbatim) and no track circle — just the progress arc and the
 *  percentage. Positioning + show/hide still come from .scroll-progress. */
export default function ScrollRing({ progress, visible }: ScrollRingProps) {
  const pct = Math.round(progress * 100);
  return (
    <div
      className={`scroll-progress${visible ? " show" : ""}`}
      id="scrollProgress"
      aria-hidden="true"
      style={{
        background: "none",
        border: "none",
        boxShadow: "none",
        padding: 0,
      }}
    >
      <div className="progress-ring">
        <svg width="46" height="46" viewBox="0 0 46 46">
          <circle
            id="ring"
            cx="23"
            cy="23"
            r="19"
            style={{ stroke: "var(--primary)" }}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={(CIRC * (1 - progress)).toFixed(1)}
          />
        </svg>
        <div className="pct" id="pct">
          {pct}%
        </div>
      </div>
    </div>
  );
}
