import { FEATURED_PLATFORMS } from "@/lib/courses";
import { useI18n } from "@/lib/i18n";

export function TrustedPlatforms() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="trusted-platforms" className="mx-auto max-w-7xl px-5 pb-20 md:pb-24">
      <div className="mx-auto max-w-2xl text-center animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {t("platforms.kicker")}
        </p>
        <h2 id="trusted-platforms" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {t("platforms.title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">{t("platforms.subtitle")}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-10 md:grid-cols-5">
        {FEATURED_PLATFORMS.map((p, i) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={p.name}
            className="group flex h-16 items-center justify-center rounded-xl border border-border/70 bg-card/60 px-4 text-sm font-semibold tracking-tight text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:text-foreground hover:shadow-[0_10px_30px_-16px_oklch(0.72_0.11_185/0.55)] animate-fade-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="opacity-80 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0">
              {p.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
