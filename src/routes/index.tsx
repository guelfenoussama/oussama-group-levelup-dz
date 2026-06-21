import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Trophy, HeartHandshake, ArrowRight, Globe2, Target, Rocket } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LevelUp DZ — Opportunities for Algerian Students" },
      { name: "description", content: "Find summer courses, competitions and volunteering to build a world-class university portfolio from Algeria." },
      { property: "og:title", content: "LevelUp DZ" },
      { property: "og:description", content: "Find summer courses, competitions and volunteering to build a world-class university portfolio from Algeria." },
    ],
  }),
  component: Index,
});

const categories = [
  { icon: BookOpen, title: "Summer Courses", desc: "Programming, English, AI, soft skills — taught by the best.", tint: "bg-[oklch(0.94_0.05_185)] text-[oklch(0.32_0.08_195)]" },
  { icon: Trophy, title: "Competitions & Olympiads", desc: "Hackathons, math & informatics olympiads, global contests.", tint: "bg-[oklch(0.95_0.06_70)] text-[oklch(0.4_0.12_60)]" },
  { icon: HeartHandshake, title: "Volunteering & Charities", desc: "Make social impact at home and around the world.", tint: "bg-[oklch(0.94_0.05_350)] text-[oklch(0.38_0.12_350)]" },
];

const stats = [
  { icon: Globe2, label: "Global & local programs" },
  { icon: Target, label: "Curated for DZ students" },
  { icon: Rocket, label: "Built for top universities" },
];

function Index() {
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
        <div className="mx-auto max-w-7xl px-5 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground soft-shadow">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Made in Algeria · for Algerian students
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Build the portfolio that gets you into{" "}
              <span className="brand-gradient-text">world-class universities</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              LevelUp DZ gathers the courses, competitions and volunteering opportunities
              that turn smart Algerian students into international candidates.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/directory"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] hover:opacity-95"
              >
                Browse opportunities <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary"
              >
                Our mission
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              {stats.map((s) => (
                <span key={s.label} className="inline-flex items-center gap-1.5">
                  <s.icon className="h-3.5 w-3.5 text-primary" /> {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.title}
              to="/directory"
              className="group rounded-2xl border border-border bg-card p-7 soft-shadow card-lift animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${c.tint}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
