import { Code2, BrainCircuit, Globe, Languages, Users, type LucideIcon } from "lucide-react";
import type { Course } from "./courses";

export type CategoryTheme = {
  icon: LucideIcon;
  /** oklch color used for accent (icon, progress, button glow) */
  color: string;
  /** short label used for progress bar gradient end */
  colorSoft: string;
};

export const CATEGORY_THEME: Record<Course["category"], CategoryTheme> = {
  programming: {
    icon: Code2,
    color: "oklch(0.72 0.15 250)", // blue
    colorSoft: "oklch(0.82 0.12 250)",
  },
  ai: {
    icon: BrainCircuit,
    color: "oklch(0.80 0.13 200)", // cyan
    colorSoft: "oklch(0.88 0.10 200)",
  },
  learningenglish: {
    icon: Globe,
    color: "oklch(0.76 0.16 150)", // green
    colorSoft: "oklch(0.85 0.13 150)",
  },
  learningfrench: {
    icon: Languages,
    color: "oklch(0.74 0.17 300)", // purple
    colorSoft: "oklch(0.83 0.14 300)",
  },
  softskills: {
    icon: Users,
    color: "oklch(0.85 0.15 90)", // yellow
    colorSoft: "oklch(0.90 0.12 90)",
  },
};

export function categoryStyle(category: Course["category"]): React.CSSProperties {
  const t = CATEGORY_THEME[category];
  return {
    // consumed by utility classes / inline styles in components
    ["--cat" as string]: t.color,
    ["--cat-soft" as string]: t.colorSoft,
  };
}