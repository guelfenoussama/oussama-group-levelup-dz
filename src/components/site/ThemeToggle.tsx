import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Until mounted, read directly from <html> (set pre-paint by the no-flash script)
  // so the icon never flickers and the button reserves its space.
  const isDark = mounted
    ? theme === "dark"
    : typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true;
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-card text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-secondary hover:shadow-[0_6px_18px_-8px_oklch(0.52_0.09_185/0.45)]"
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ease-out ${
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ease-out ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}