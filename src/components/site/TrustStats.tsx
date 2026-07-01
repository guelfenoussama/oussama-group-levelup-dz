import { BookOpen, Layers, Globe2, Building2 } from "lucide-react";
import { COURSE_STATS } from "@/lib/courses";
import { CountUp } from "./CountUp";
import { useI18n } from "@/lib/i18n";

export function TrustStats() {
  const { t } = useI18n();
  const items = [
    { icon: BookOpen, value: COURSE_STATS.courses, label: t("trust.courses"), suffix: "+" },
    { icon: Layers, value: COURSE_STATS.categories, label: t("trust.categories") },
    { icon: Globe2, value: COURSE_STATS.languages, label: t("trust.languages") },
    { icon: Building2, value: COURSE_STATS.platforms, label: t("trust.platforms"), suffix: "+" },
  ];
  return (
    <section aria-labelledby="trust-stats" className="mx-auto max-w-7xl px-5 pb-16 md:pb-20">
      <h2 id="trust-stats" className="sr-only">{t("trust.title")}</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 soft-shadow card-lift animate-fade-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <it.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-2xl font-semibold leading-none tracking-tight md:text-3xl">
                  <CountUp end={it.value} suffix={it.suffix ?? ""} />
                </div>
                <div className="mt-1.5 truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {it.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
