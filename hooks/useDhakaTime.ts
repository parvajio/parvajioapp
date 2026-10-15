import { useEffect, useState } from "react";

export type DhakaTime = {
  /** Formatted "h:mm AM/PM" in Asia/Dhaka; "--:--" until mounted. */
  time: string;
  /** Night | Morning | Afternoon | Evening; "" until mounted. */
  part: string;
  /** True for 06:00–17:59 Dhaka time; defaults to day for first paint. */
  isDay: boolean;
};

const INITIAL: DhakaTime = { time: "--:--", part: "", isDay: true };

function computeDhakaTime(now: Date): DhakaTime {
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(now);
  const hour =
    parseInt(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: "Asia/Dhaka",
      }).format(now),
      10,
    ) % 24;
  const part =
    hour < 5
      ? "Night"
      : hour < 12
        ? "Morning"
        : hour < 17
          ? "Afternoon"
          : hour < 21
            ? "Evening"
            : "Night";
  return { time, part, isDay: hour >= 6 && hour < 18 };
}

/**
 * Live Dhaka clock. Ports tick() from old/index.html: "--:--" on first
 * render, real time set in useEffect after mount, refreshed every 20s,
 * interval cleaned up on unmount.
 */
export function useDhakaTime(): DhakaTime {
  const [dhaka, setDhaka] = useState<DhakaTime>(INITIAL);

  useEffect(() => {
    const update = () => setDhaka(computeDhakaTime(new Date()));
    update();
    const id = window.setInterval(update, 20000);
    return () => window.clearInterval(id);
  }, []);

  return dhaka;
}
