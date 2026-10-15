# Plan — old/index.html → Next.js App Router + TypeScript

Approved with changes. Scope split into steps; this file records the agreed plan.
Step 1 (foundation + Hero) is implemented first; WorkShell and below follow after verification.

## Ground rules

- Pixel-identical result. `app/globals.css` = verbatim `<style>` block from `old/index.html`,
  except: Geist `@font-face` removed (use `next/font` instead). No CSS refactor.
- No Tailwind. Remove `@import "tailwindcss"`, remove turbopack css rule in
  `next.config.ts`, uninstall `tailwindcss` + `@tailwindcss/turbopack` deps.
- Google Fonts + Geist replaced by `next/font`, wired via CSS variables.
- `lucide-react` for icons (replaces inline SVGs in Hero scope; rest later).
- `use client` only where needed (interactive leaves).
- Theme/accent: inline script in layout `<head>` sets `data-theme`/`data-accent`
  from `localStorage` before paint; `suppressHydrationWarning` on `<html>`.
- Theme icon (moon/sun) and active swatch are CSS-driven via
  `html[data-theme]` / `html[data-accent]` selectors, NOT React state.
- `localStorage` keys + inline theme script string live in `lib/theme.ts`.
- All `onclick`/`innerHTML`/`querySelector` logic becomes React state/refs/hooks,
  every listener cleaned up in `useEffect`.

## File tree (full conversion)

```text
app/
  layout.tsx      # server: metadata, next/font vars, <head> theme script, suppressHydrationWarning
  globals.css     # verbatim CSS (minus Geist @font-face) + font-var wiring + CSS-driven additions
  page.tsx        # server composition: <Hero/> + <WorkShell/> (hero-only until step 2)

components/
  Hero.tsx        # section#hero (server): topbar, hero-mid, desc, stack; composes Shutter + ThemeControls
  Shutter.tsx     # client: button.shutter-wrap open/peek, aria-expanded, reduced-motion
  ThemeControls.tsx # client: swatches + theme toggle; DOM-mutating only, no active/theme state
  WorkShell.tsx   # (step 2) section#work: cols grid, curTab, collapsed, mainCol ref, up-btn
  Sidebar.tsx     # (step 2) aside.col-nav
  PageBar.tsx     # (step 2) div.page-bar
  RightRail.tsx   # (step 2) aside.col-info
  ProfileTab.tsx  # (step 2) div#tab-profile
  ProjectsTab.tsx # (step 2) div#tab-works
  ContactTab.tsx  # (step 2) div#tab-contact
  DhakaClock.tsx  # (step 2) .live-time/.live-part/sun-moon
  ScrollRing.tsx  # (step 2) div#scrollProgress

hooks/
  useDhakaTime.ts      # (step 2) replaces tick()+setInterval
  useScrollSpy.ts      # (step 2) replaces buildToc()+onScroll()+scrollToSec()
  useHardScrollBack.ts # (step 2) replaces ring/acc/NEED/wheel logic

data/
  works.ts    # (step 2) works[4] array + Work type
  profile.ts  # step 1: accents only; step 2: chips, stack kv, timeline, langs, contacts, rail links, ctxStatic

lib/
  theme.ts    # step 1: THEME_KEY, ACCENT_KEY, Theme/Accent types, get/init helpers,
              #         toggleTheme/setAccent (DOM-only), THEME_INIT_SCRIPT string
```

## Step 1 scope (implement now, stop after hero)

1. `PLAN.md` (this file).
2. Foundation: `npm i lucide-react`; `npm uninstall tailwindcss @tailwindcss/turbopack`;
   remove turbopack `*.css` rule from `next.config.ts`.
3. `lib/theme.ts` — keys + script string + DOM helpers.
4. `data/profile.ts` — accents only (`ACCENTS` with gradient + label, from old swatches).
5. `app/globals.css` — full `<style>` verbatim minus 4 Geist `@font-face` blocks;
   `font-family:'X'` wired to `var(--font-*)`; append CSS-driven rules:
   `#iconMoon/#iconSun` visibility via `html[data-theme]`, `.swatch` highlight via
   `html[data-accent="…"] .swatch[data-accent="…"]`. Keep `.swatch.active` rule untouched.
6. `app/layout.tsx` — server: `Space_Grotesk`, `Instrument_Serif`, `Inter`,
   `JetBrains_Mono`, `Geist` via `next/font/google` with `variable`; `<html
   data-theme="dark" data-accent="grape" suppressHydrationWarning className={vars}>`;
   `<head><script dangerouslySetInnerHTML={{__html: THEME_INIT_SCRIPT}} /></head>`;
   metadata title `PARVA — Developer / Problem Solver`.
7. `components/Shutter.tsx` (client), `components/ThemeControls.tsx` (client),
   `components/Hero.tsx` (server, composes the two). `app/page.tsx` renders `<Hero/>` only.
8. Verify: `npm run lint && npm run build`. Visual check hero vs `old/index.html`.

Explicitly NOT in step 1: WorkShell, Sidebar, PageBar, RightRail, Profile/Projects/Contact
tabs, `hooks/*`, `data/works.ts`, full `data/profile.ts` content.

## Component responsibilities (step 1 detail)

- `layout.tsx`: fonts, theme script, html attrs. No state.
- `lib/theme.ts`: single source of truth for `parva-theme` / `parva-accent` keys and
  the pre-paint script. `toggleTheme()` / `setAccent()` write `documentElement.dataset`
  + `localStorage` only; visual update comes from CSS.
- `ThemeControls.tsx`: renders `.swatches` (from `ACCENTS`) + `.theme-toggle` with
  `Moon`/`Sun` lucide icons (`#iconMoon`/`#iconSun` ids preserved for CSS). No
  `useState` for theme/accent; `onClick` calls lib helpers.
- `Shutter.tsx`: `open` state only (`useState<boolean>`); `peek` via `useEffect`
  timeouts (1200ms add, 650ms remove), `matchMedia('(prefers-reduced-motion: reduce)')`
  guard; cleanup both timeouts. `aria-expanded`, `open`/`peek` classes.
- `Hero.tsx`: pixel-identical `section#hero` markup: `.grid-lines`, `.topbar` →
  `<ThemeControls/>`, `.hero-mid.clean` → `.hey`, `<Shutter/>`, `.desc`
  (`.desc-head` + 3 `.feat` with `data-text` + `--d`, `.desc-sub`), `.stack` 5 items.
- `DhakaClock`, tabs, rails, hooks: deferred.

## Logic mapping (old → React, step 1 slice)

| Old inline JS | New |
|---|---|
| `applyTheme` icon `style.display` toggling | deleted; CSS `html[data-theme]` shows Moon/Sun |
| `setAccent` `.active` class loop | deleted; CSS `html[data-accent] .swatch[data-accent]` highlights |
| init IIFE reading `localStorage` + `prefers-color-scheme` | `THEME_INIT_SCRIPT` in `<head>` (pre-paint) + `suppressHydrationWarning` |
| `toggleTheme()` / `setAccent(a)` | `lib/theme.ts` DOM-only helpers called from `ThemeControls` |
| `toggleShutter(el)` + peek IIFE | `Shutter.tsx` state + effect with cleanup |
| Geist `@font-face` woff2 | `Geist` via `next/font/google`, `--font-geist-sans` var |

## Verification

- `npm run lint`, `npm run build` green.
- Hero screenshot vs `old/index.html` hero: topbar swatches + toggle, hey line,
  shutter closed/reveal/peek, desc-head sheen, stack pills, responsive + reduced-motion.
