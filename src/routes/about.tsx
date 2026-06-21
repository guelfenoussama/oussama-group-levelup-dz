import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, GraduationCap, HandHeart, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Mission — LevelUp DZ" },
      { name: "description", content: "LevelUp DZ exists to help Algerian students access the opportunities that lead to top universities abroad." },
      { property: "og:title", content: "Our Mission — LevelUp DZ" },
      { property: "og:description", content: "LevelUp DZ exists to help Algerian students access the opportunities that lead to top universities abroad." },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  const pillars = [
    { icon: GraduationCap, title: t("about.pillar1.title"), desc: t("about.pillar1.desc") },
    { icon: Compass, title: t("about.pillar2.title"), desc: t("about.pillar2.desc") },
    { icon: HandHeart, title: t("about.pillar3.title"), desc: t("about.pillar3.desc") },
  ];
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <div className="animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("about.kicker")}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {t("about.title.a")}<span className="brand-gradient-text">{t("about.title.b")}</span>{t("about.title.c")}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t("about.p1")}</p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t("about.p2")}</p>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {pillars.map((p, i) => (
          <div
            key={p.title}
            className="rounded-2xl border border-border bg-card p-6 soft-shadow animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-border bg-card p-8 soft-shadow md:p-12 animate-fade-up">
        <h2 className="text-2xl font-semibold tracking-tight">{t("about.ready.title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("about.ready.desc")}</p>
        <Link
          to="/directory"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02]"
        >
          {t("about.ready.cta")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}