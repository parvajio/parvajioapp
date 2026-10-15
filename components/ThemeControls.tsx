"use client";

import { Moon, Sun } from "lucide-react";
import { ACCENTS } from "@/data/profile";
import { setAccent, toggleTheme } from "@/lib/theme";

export default function ThemeControls() {
  return (
    <div className="top-right">
      <div className="swatches" id="swatches" title="pick accent">
        <span className="sw-label">COLOR</span>
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
      <button
        type="button"
        className="theme-toggle"
        id="themeBtn"
        onClick={toggleTheme}
        aria-label="toggle theme"
      >
        <Moon id="iconMoon" size={18} strokeWidth={1.4} aria-hidden="true" />
        <Sun id="iconSun" size={18} strokeWidth={1.4} aria-hidden="true" />
      </button>
    </div>
  );
}
