import type { CSSProperties } from "react";
import Shutter from "./Shutter";
import ThemeControls from "./ThemeControls";

const STACK = ["NEXT.JS", "TYPESCRIPT", "NODE.JS", "POSTGRESQL", "AI SDK"];

export default function Hero() {
  return (
    <section id="hero">
      <div className="grid-lines" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="topbar">
        <ThemeControls />
      </div>

      <div className="hero-mid clean">
        <div className="hey">Hey, I&apos;m Parvaj </div>
        <Shutter />
        <p className="desc">
          <strong className="desc-head">
            I engineer{" "}
            <span className="feat" data-text="fast,">
              fast,
            </span>{" "}
            <span
              className="feat"
              data-text="clean,"
              style={{ "--d": ".35s" } as CSSProperties}
            >
              clean,
            </span>{" "}
            <span
              className="feat"
              data-text="secure"
              style={{ "--d": ".7s" } as CSSProperties}
            >
              secure
            </span>{" "}
            web apps.
          </strong>
          <span className="desc-sub">
            Scalable, maintainable, and ready for real users.
          </span>
        </p>
        <div className="stack">
          {STACK.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
