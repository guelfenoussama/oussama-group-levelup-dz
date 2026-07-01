import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Languages as LanguagesIcon, Sparkles, ArrowRight, Globe2, Target, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { StreakWidget } from "@/components/site/StreakWidget";
import { TrustStats } from "@/components/site/TrustStats";
import { TrustedPlatforms } from "@/components/site/TrustedPlatforms";
import { Testimonials } from "@/components/site/Testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LevelUp DZ — Real Skills for Algerian Students" },
      { name: "description", content: "Courses in programming, languages and modern skills to help Algerian students build a strong foundation and stand out internationally." },
      { property: "og:title", content: "LevelUp DZ" },
      { property: "og:description", content: "Courses in programming, languages and modern skills to help Algerian students build a strong foundation and stand out internationally." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const categories = [
    { icon: Code2, title: t("home.cat.coding.title"), desc: t("home.cat.coding.desc"), tint: "bg-[oklch(0.94_0.05_185)] text-[oklch(0.32_0.08_195)]" },
    { icon: LanguagesIcon, title: t("home.cat.lang.title"), desc: t("home.cat.lang.desc"), tint: "bg-[oklch(0.95_0.06_70)] text-[oklch(0.4_0.12_60)]" },
    { icon: Sparkles, title: t("home.cat.ai.title"), desc: t("home.cat.ai.desc"), tint: "bg-[oklch(0.94_0.05_350)] text-[oklch(0.38_0.12_350)]" },
  ];
  const stats = [
    { icon: Globe2, label: t("home.stat.global") },
    { icon: Target, label: t("home.stat.curated") },
    { icon: Rocket, label: t("home.stat.built") },
  ];
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, oklch(0.94 0.05 185 / 0.6), transparent 70%), radial-gradient(40% 40% at 80% 30%, oklch(0.95 0.06 70 / 0.4), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-5 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground soft-shadow">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t("home.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              {t("home.title.a")}
              <span className="brand-gradient-text">{t("home.title.b")}</span>
              {t("home.title.c")}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("home.subtitle")}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/directory"
                className="btn-pop group relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.11_185/0.6)] hover:opacity-95 md:text-base"
              >
                {t("home.cta.browse")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
              <Link
                to="/about"
                className="btn-pop inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3.5 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40"
              >
                {t("home.cta.mission")}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              {stats.map((s) => {
                const isBuilt = s.label === t("home.stat.built");
                return (
                  <span
                    key={s.label}
                    className={
                      isBuilt
                        ? "group inline-flex cursor-default items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.04] hover:border-primary hover:bg-primary/10 hover:shadow-[0_8px_24px_-12px_oklch(0.72_0.11_185/0.55)]"
                        : "inline-flex items-center gap-1.5"
                    }
                  >
                    <s.icon
                      className={
                        isBuilt
                          ? "h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:rotate-12"
                          : "h-3.5 w-3.5 text-primary"
                      }
                    />{" "}
                    {s.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Trust — real stats derived from the directory */}
      <TrustStats />

      {/* Trusted learning platforms */}
      <TrustedPlatforms />

      {/* Daily streak / gamified tracker */}
      <div className="pb-12 md:pb-16">
        <StreakWidget />
      </div>

      {/* Categories */}
      <section aria-labelledby="cats" className="mx-auto max-w-7xl px-5 pb-20 md:pb-24">
        <div className="mx-auto mb-10 max-w-2xl text-center animate-fade-up">
          <h2 id="cats" className="text-2xl font-semibold tracking-tight md:text-3xl">
            Three tracks, one goal
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Pick where you want to grow first — you can always switch tracks later.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.title}
              to="/directory"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 soft-shadow card-lift animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 80% at 100% 0%, oklch(0.72 0.11 185 / 0.12), transparent 70%)",
                }}
              />
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${c.tint}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 text-lg font-semibold tracking-tight">{c.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <span className="relative mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {t("home.explore")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Social proof — testimonials placeholder */}
      <Testimonials />
    </>
  );
}
