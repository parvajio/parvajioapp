export const THEME_KEY = "parva-theme";
export const ACCENT_KEY = "parva-accent";

export type Theme = "dark" | "light";
export type Accent = "grape" | "ultra" | "blue" | "teal" | "green";

export const DEFAULT_THEME: Theme = "dark";
export const DEFAULT_ACCENT: Accent = "grape";

/**
 * Pre-paint inline script for <head>. Mirrors old/index.html init IIFE but
 * only touches data attributes — icon/swatch visuals are CSS-driven, so no
 * DOM queries for #iconMoon/#iconSun or .swatch.active here.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}")||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");var a=localStorage.getItem("${ACCENT_KEY}")||"${DEFAULT_ACCENT}";document.documentElement.dataset.theme=t;document.documentElement.dataset.accent=a;}catch(e){document.documentElement.dataset.theme="${DEFAULT_THEME}";document.documentElement.dataset.accent="${DEFAULT_ACCENT}";}})()`;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — theme still applies for this session */
  }
}

export function getStoredTheme(): Theme {
  const t = safeGet(THEME_KEY);
  return t === "light" || t === "dark" ? t : DEFAULT_THEME;
}

export function getStoredAccent(): Accent {
  const a = safeGet(ACCENT_KEY);
  return a === "grape" ||
    a === "ultra" ||
    a === "blue" ||
    a === "teal" ||
    a === "green"
    ? a
    : DEFAULT_ACCENT;
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  safeSet(THEME_KEY, theme);
}

export function toggleTheme(): void {
  const next: Theme =
    document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(next);
}

export function setAccent(accent: Accent): void {
  document.documentElement.dataset.accent = accent;
  safeSet(ACCENT_KEY, accent);
}
