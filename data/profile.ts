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
