# Portfolio port: old/index.html → Next.js (App Router, TypeScript)

## Goal
Port `old/index.html` into a Next.js project. The result must be
pixel-identical to the original. The single-file original is the source of truth.
Detailed plan: `PLAN.md`.

## Hard rules
- No Tailwind. Do not add it back or use utility classes.
- Do not refactor or "clean up" CSS. `app/globals.css` is the original
  `<style>` block, changed only for `next/font` variables and the CSS-driven
  theme/accent rules already appended.
- Preserve the original HTML structure and class names exactly.
- Icons: `lucide-react` only. No inline SVG unless no matching icon exists.
- Replace all inline `onclick`, `innerHTML` and `querySelector` logic with
  React state, refs and hooks.
- Every `addEventListener`, `setTimeout` and `setInterval` must be cleaned up
  in the `useEffect` return.
- Use `'use client'` only on interactive leaves. Keep pages and static
  sections as server components.
- Do not touch files outside the current step's scope.

## Theme and accent
- Theme and accent live on `<html data-theme data-accent>`.
- The pre-paint inline script (`THEME_INIT_SCRIPT` in `lib/theme.ts`) sets them
  from localStorage. Keys: `parva-theme`, `parva-accent`, `parva-nav`.
- Icons (moon/sun) and the active swatch are CSS-driven via
  `html[data-theme]` / `html[data-accent]`. Never mirror theme or accent
  into React state.
- Anything that reads localStorage must do it in `useEffect` after mount
  (no hydration mismatch). Flag any resulting visible flash instead of
  hacking around it.

## Structure
app/        layout.tsx, page.tsx, globals.css
components/ Hero, Shutter, ThemeControls, WorkShell, Sidebar, PageBar,
            RightRail, ProfileTab, ProjectsTab, ContactTab,
            DhakaClock, ScrollRing
hooks/      useDhakaTime, useScrollSpy, useHardScrollBack
data/       profile.ts, works.ts   (typed exports, no JSX)
lib/        theme.ts

## Behavior notes
- Clock: render `--:--` on first render, set the real time in `useEffect`.
- `useScrollSpy` must rebuild its section list whenever the current tab
  changes (the original did this inside `showTab()`).
- `useHardScrollBack` must expose `goHero` (the up button also uses it).
  The wheel listener needs `{ passive: false }`.
- Tab content is conditionally rendered. Keep `data-toc` attributes on
  sections for the scroll spy.

## Workflow
- Work ONE step at a time. Plan first, no code until I approve. Stop after
  the step.
- After each step run `npm run lint && npm run build`. Fix errors before
  reporting.
- Report: files created/changed, anything that deviates from the original,
  and anything I should verify visually.
- Never commit. I commit after verifying.

## Progress
- [x] Step 1: foundation (layout, globals.css, fonts, theme script, lib/theme.ts)
- [x] Step 2: Hero, Shutter, ThemeControls
- [x] Step 3: WorkShell, Sidebar, PageBar, tab placeholders, empty right-rail aside
- [ ] Step 4: ProfileTab + RightRail (TOC, scroll spy, DhakaClock)
- [ ] Step 5: ProjectsTab + data/works.ts + hover → rail context
- [ ] Step 6: ContactTab, ScrollRing, up button
- [ ] Step 7: cleanup (placeholder links/email, metadata, final build)
- [ ] Step 8 (after port is verified): mobile navbar redesign. Below 720px,replace the sidebar strip with a top bar: menu button, theme toggle,contact button. Content only, no right rail. Desktop unchanged.

## Out of scope until Step 8
- Do not redesign mobile navigation. In Step 3, port the original
  responsive CSS behavior exactly as it is in old/index.html.

## Known content issues (fix only in Step 7)
- `hello@parva.dev` is a placeholder (used in 2 places).
- GitHub, LinkedIn and Resume links are `href="#"`.
- The "Library" nav item goes nowhere.
- Name inconsistency: PARVA / Parva Mosharof / Parvaj.