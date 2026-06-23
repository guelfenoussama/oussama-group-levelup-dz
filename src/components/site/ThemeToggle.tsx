import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={
        compact
          ? "grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-secondary"
          : "grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary hover:bg-secondary"
      }
    >
      <Sun className={`h-4 w-4 transition-all ${isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"} absolute`} />
      <Moon className={`h-4 w-4 transition-all ${isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"}`} />
    </button>
  );
}