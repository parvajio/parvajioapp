"use client";

import { Moon, Sun } from "lucide-react";
import { useDhakaTime } from "@/hooks/useDhakaTime";

type DhakaClockProps = {
  /**
   * inline — hero-meta line: just the .live-time span.
   * panel — "Based in" card: .clock + .part ("GMT+6").
   * rail — right-rail LOCAL TIME block: .clock + .part ("Dhaka · GMT+6").
   */
  variant: "inline" | "panel" | "rail";
};

export default function DhakaClock({ variant }: DhakaClockProps) {
  const { time, part, isDay } = useDhakaTime();

  if (variant === "inline") {
    return <span className="live-time">{time}</span>;
  }

  return (
    <>
      <div className="clock">
        <b className="live-time">{time}</b>
        <span>{variant === "rail" ? "Dhaka · GMT+6" : "GMT+6"}</span>
      </div>
      <div className="part">
        {isDay ? (
          <Sun className="ico-sun" aria-hidden="true" />
        ) : (
          <Moon className="ico-moon" aria-hidden="true" />
        )}
        <span className="live-part">{part ? `${part} in Dhaka` : ""}</span>
      </div>
    </>
  );
}
