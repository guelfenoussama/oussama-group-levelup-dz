import { ArrowUpRight, Calendar, MapPin, Wifi, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { bumpCourseProgress, getCourseProgress } from "@/lib/tracker";
import { ShareButtons } from "@/components/site/ShareButtons";

type Opp = Database["public"]["Tables"]["opportunities"]["Row"];

const courseBadge = {
  tKey: "card.cat.courses",
  className: "bg-[oklch(0.94_0.05_185)] text-[oklch(0.32_0.08_195)]",
};

function FormatIcon({ format }: { format: string }) {
  if (format === "online") return <Wifi className="h-3.5 w-3.5" />;
  if (format === "in_person") return <MapPin className="h-3.5 w-3.5" />;
  return <Building2 className="h-3.5 w-3.5" />;
}

export function OpportunityCard({ opp, index = 0 }: { opp: Opp; index?: number }) {
  const { t, lang } = useI18n();
  const cat = courseBadge;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(getCourseProgress(opp.id));
    const onSync = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (!detail || detail.id === opp.id) setProgress(getCourseProgress(opp.id));
    };
    window.addEventListener("lu:progress", onSync);
    return () => window.removeEventListener("lu:progress", onSync);
  }, [opp.id]);

  const onOpen = () => setProgress(bumpCourseProgress(opp.id));

  return (
    <article
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 soft-shadow card-lift animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("rounded-full px-3 py-1 text-xs font-medium", cat.className)}>{t(cat.tKey)}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground capitalize">
          <FormatIcon format={opp.format} />
          {t(`dir.fmt.${opp.format}`)}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">{opp.title}</h3>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{t("card.by")} {opp.organizer}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{opp.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {opp.tag && (
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            #{opp.tag}
          </span>
        )}
        {opp.deadline && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(opp.deadline).toLocaleDateString(lang === "ar" ? "ar" : undefined, { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )}
      </div>
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>{t("card.progress")}</span>
          <span className={progress >= 100 ? "text-primary" : ""}>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: "var(--brand-gradient)",
            }}
          />
        </div>
      </div>
      <a
        href={opp.link}
        target="_blank"
        rel="noreferrer noopener"
        onClick={onOpen}
        className="btn-pop mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-95 group-hover:gap-2.5"
      >
        {t("card.apply")}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-12 rtl:-scale-x-100" />
      </a>
      <div className="mt-4 border-t border-border/60 pt-3">
        <ShareButtons url={opp.link} title={opp.title} label={t("share.course.label")} />
      </div>
    </article>
  );
}