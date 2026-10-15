import type { LucideIcon } from "lucide-react";
import { Mail } from "lucide-react";
import type { Accent } from "@/lib/theme";

export type AccentOption = {
  id: Accent;
  label: string;
  gradient: string;
};

/** Accent swatches — gradients + labels copied verbatim from old/index.html. */
export const ACCENTS: AccentOption[] = [
  {
    id: "grape",
    label: "grape purple",
    gradient: "linear-gradient(135deg,#A78BFA,#6D28D9)",
  },
  {
    id: "ultra",
    label: "ultra violet",
    gradient: "linear-gradient(135deg,#E9D5FF,#9333EA)",
  },
  {
    id: "blue",
    label: "blue",
    gradient: "linear-gradient(135deg,#60A5FA,#1D4ED8)",
  },
  {
    id: "teal",
    label: "teal",
    gradient: "linear-gradient(135deg,#2DD4BF,#0F766E)",
  },
  {
    id: "green",
    label: "green",
    gradient: "linear-gradient(135deg,#34D399,#047857)",
  },
];

export type Chip = {
  label: string;
  color: string;
};

/** Hero chips — labels + dot colors copied verbatim from old/index.html. */
export const CHIPS: Chip[] = [
  { label: "Next.js", color: "#94A3B8" },
  { label: "TypeScript", color: "#3178C6" },
  { label: "JavaScript", color: "#F7DF1E" },
  { label: "Node.js", color: "#5FA04E" },
  { label: "NestJS", color: "#E0234E" },
  { label: "Express", color: "#94A3B8" },
  { label: "PostgreSQL", color: "#336791" },
  { label: "MongoDB", color: "#47A248" },
  { label: "MySQL", color: "#4479A1" },
  { label: "Prisma", color: "#5A67D8" },
  { label: "Drizzle", color: "#C5F74F" },
];

export type StackRow = {
  key: string;
  pills: string[];
};

/** Stack section kv rows — copied verbatim from old/index.html. */
export const STACK_ROWS: StackRow[] = [
  { key: "Frontend", pills: ["Next.js", "TypeScript", "JavaScript"] },
  { key: "Backend", pills: ["Node.js", "Express", "NestJS"] },
  { key: "Databases", pills: ["PostgreSQL", "MongoDB", "MySQL"] },
  { key: "ORM", pills: ["Prisma", "Drizzle"] },
];

export type TimelineItem = {
  title: string;
  meta: string;
  text: string;
};

/** Journey timeline — copied verbatim from old/index.html. */
export const TIMELINE: TimelineItem[] = [
  {
    title: "B.Sc. in Computer Science & Engineering",
    meta: "Uttara University, Dhaka · 3rd year",
    text: "Core CS foundations alongside hands-on full-stack projects.",
  },
  {
    title: "Full-stack developer",
    meta: "Independent projects · Ongoing",
    text: "Building web platforms with Next.js, TypeScript, Node.js and SQL/NoSQL databases.",
  },
  {
    title: "Private tutor",
    meta: "Self-employed · ~8 years",
    text: "Teaching students one-on-one while studying.",
  },
];

export type Language = {
  name: string;
  level: string;
};

/** Languages panel — copied verbatim from old/index.html. */
export const LANGUAGES: Language[] = [
  { name: "Bangla", level: "Native" },
  { name: "English", level: "Professional" },
];

export type RailIcon = "github" | "linkedin" | LucideIcon;

export type RailLink = {
  label: string;
  href: string;
  icon: RailIcon;
};

/** Right-rail links block — GitHub/LinkedIn/Email with real hrefs (Step 7).
 *  Resume removed per owner request. GitHub/LinkedIn use string keys: this
 *  lucide-react version ships no brand icons, so RightRail renders the
 *  original inline SVGs for those two only. */
export const RAIL_LINKS: RailLink[] = [
  { label: "GitHub", href: "https://github.com/parvajio", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/parvajio",
    icon: "linkedin",
  },
  { label: "Email", href: "mailto:hello@parvajio.dev", icon: Mail },
];

export type CtxBlock = {
  heading: string;
  rows: { k: string; v: string }[];
};

/** Static right-rail context blocks — copied verbatim from ctxStatic in
 *  old/index.html. The projects variant arrives in Step 5. */
export const CTX_STATIC: Record<"profile" | "contact", CtxBlock> = {
  profile: {
    heading: "QUICK FACTS",
    rows: [
      { k: "Studying", v: "CSE · 3rd year" },
      { k: "Focus", v: "Full-stack web" },
      { k: "Teaching", v: "~8 years" },
      { k: "Status", v: "Open to work" },
    ],
  },
  contact: {
    heading: "RESPONSE",
    rows: [
      { k: "Reply time", v: "< 24 hours" },
      { k: "Best channel", v: "Email" },
      { k: "Timezone", v: "GMT+6" },
    ],
  },
};
