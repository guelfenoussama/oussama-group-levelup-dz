import { Quote, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Testimonials() {
  const { t } = useI18n();
  const cards = [0, 1, 2];
  return (
    <section aria-labelledby="testimonials" className="mx-auto max-w-7xl px-5 pb-24">
      <div className="mx-auto max-w-2xl text-center animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {t("stories.kicker")}
        </p>
        <h2 id="testimonials" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {t("stories.title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">{t("stories.subtitle")}</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((i) => (
          <div
            key={i}
            className="relative flex h-full flex-col justify-between rounded-2xl border border-dashed border-border bg-card/60 p-6 soft-shadow animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <Quote className="h-6 w-6 text-primary/40" aria-hidden />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("stories.placeholder")}
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{t("stories.slot")}</p>
                <p className="truncate text-xs text-muted-foreground">{t("stories.slotDesc")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
