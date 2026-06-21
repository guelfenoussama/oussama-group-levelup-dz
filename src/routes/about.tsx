import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, GraduationCap, HandHeart, ArrowRight } from "lucide-react";

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

const pillars = [
  { icon: GraduationCap, title: "Open the doors", desc: "Curated programs that admissions officers in Cambridge, MIT and Paris recognize." },
  { icon: Compass, title: "Show the way", desc: "Filter by category and format so you find what fits your level and your city." },
  { icon: HandHeart, title: "Lift the community", desc: "Volunteering work that builds character and improves life in Algeria." },
];

function About() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <div className="animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our mission</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Algerian talent deserves a <span className="brand-gradient-text">world stage</span>.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Every year, brilliant Algerian students are held back not by ability, but by access.
          They don't know the summer school exists. They miss the olympiad deadline. They never
          hear about the volunteering program that would have made their CV unforgettable.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          LevelUp DZ fixes that. We gather, vet and translate the opportunities — courses,
          competitions and volunteering — that build the kind of portfolio top universities
          actually want. Free. Open. Made by students, for students.
        </p>
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
        <h2 className="text-2xl font-semibold tracking-tight">Ready to level up?</h2>
        <p className="mt-2 text-muted-foreground">
          Open the directory and pick the first opportunity you'll apply to this month.
        </p>
        <Link
          to="/directory"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02]"
        >
          Browse opportunities <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}