import { FEATURED_PLATFORMS } from "@/lib/courses";
import { useI18n } from "@/lib/i18n";
import { ArrowUpRight } from "lucide-react";

type PlatformMeta = {
  slug: string; // simpleicons slug
  color: string; // brand hex without #
  span?: string; // grid span classes for bento layout
  description?: string;
  tags?: string[];
  pricing?: "Free" | "Freemium" | "Paid";
};

const META: Record<string, PlatformMeta> = {
  Coursera: {
    slug: "coursera",
    color: "0056D2",
    span: "md:col-span-2 md:row-span-2",
    description: "University-level courses",
    tags: ["Academic", "Certificates"],
    pricing: "Freemium",
  },
  edX: {
    slug: "edx",
    color: "0AA5FF",
    description: "Academic programs",
    tags: ["Academic"],
    pricing: "Freemium",
  },
  freeCodeCamp: {
    slug: "freecodecamp",
    color: "6CE0B4",
    span: "md:row-span-2",
    description: "Programming",
    tags: ["Web Dev", "Programming"],
    pricing: "Free",
  },
  "Khan Academy": {
    slug: "khanacademy",
    color: "14BF96",
    description: "Core academics",
    tags: ["Math", "Science"],
    pricing: "Free",
  },
  Udacity: {
    slug: "udacity",
    color: "02B3E4",
    description: "Tech careers",
    tags: ["Nanodegrees", "AI"],
    pricing: "Paid",
  },
  Kaggle: {
    slug: "kaggle",
    color: "20BEFF",
    span: "md:col-span-2",
    description: "Data science",
    tags: ["Data Science", "AI"],
    pricing: "Free",
  },
  "British Council": {
    slug: "britishcouncil",
    color: "FF4A5E",
    description: "English",
    tags: ["English", "Languages"],
    pricing: "Free",
  },
  Duolingo: {
    slug: "duolingo",
    color: "58CC02",
    description: "Languages",
    tags: ["Languages"],
    pricing: "Freemium",
  },
  "The Odin Project": {
    slug: "theodinproject",
    color: "F58C43",
    span: "md:col-span-2",
    description: "Full stack development",
    tags: ["Web Dev", "Programming"],
    pricing: "Free",
  },
  Scrimba: {
    slug: "scrimba",
    color: "2BD9A1",
    description: "Interactive coding",
    tags: ["Programming", "Web Dev"],
    pricing: "Freemium",
  },
};

const PRICING_STYLE: Record<"Free" | "Freemium" | "Paid", string> = {
  Free: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Freemium: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
  Paid: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
};

export function TrustedPlatforms() {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="trusted-platforms"
      className="relative mx-auto max-w-7xl overflow-hidden px-5 pb-20 md:pb-24"
    >
      {/* Ambient background: slow gradient + floating blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(50% 40% at 15% 20%, oklch(0.72 0.11 185 / 0.10), transparent 70%), radial-gradient(45% 35% at 85% 70%, oklch(0.7 0.14 300 / 0.10), transparent 70%)",
          }}
        />
        <span className="absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
        <span className="absolute bottom-10 right-1/4 h-52 w-52 rounded-full bg-[oklch(0.7_0.14_300/0.12)] blur-3xl animate-float-slower" />
      </div>

      <div className="mx-auto max-w-2xl text-center animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {t("platforms.kicker")}
        </p>
        <h2 id="trusted-platforms" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {t("platforms.title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">{t("platforms.subtitle")}</p>
      </div>

      <div className="mt-10 grid auto-rows-[11rem] grid-cols-2 gap-4 sm:gap-5 md:mt-12 md:grid-cols-4 md:gap-6">
        {FEATURED_PLATFORMS.map((p, i) => {
          const meta = META[p.name] ?? { slug: p.name.toLowerCase().replace(/\s+/g, ""), color: "72E0D0" };
          const brand = `#${meta.color}`;
          const logo = `https://cdn.simpleicons.org/${meta.slug}/${meta.color}`;
          return (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-4 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-white/25 animate-fade-up md:p-5 ${meta.span ?? ""}`}
              style={{
                animationDelay: `${i * 60}ms`,
                backgroundImage: `linear-gradient(140deg, ${brand}18 0%, transparent 55%), linear-gradient(315deg, ${brand}0d 0%, transparent 60%)`,
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.06), 0 6px 20px -12px rgba(0,0,0,0.5)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 24px 60px -20px ${brand}80, inset 0 1px 0 0 rgba(255,255,255,0.12)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `inset 0 1px 0 0 rgba(255,255,255,0.06), 0 6px 20px -12px rgba(0,0,0,0.5)`;
              }}
            >
              {/* Glowing border sheen */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(70% 90% at 50% 0%, ${brand}22, transparent 70%)`,
                }}
              />
              {/* Corner accent */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-[2px] rounded-l-2xl transition-all duration-300 group-hover:w-[3px]"
                style={{ background: `linear-gradient(180deg, ${brand}, transparent)` }}
              />

              {/* Header: logo + pricing */}
              <div className="relative flex items-start justify-between gap-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${brand}22, ${brand}0a)`,
                    boxShadow: `0 0 0 1px ${brand}20, 0 6px 18px -8px ${brand}55`,
                  }}
                >
                  <img
                    src={logo}
                    alt={`${p.name} logo`}
                    loading="lazy"
                    className="h-5 w-5 object-contain"
                    style={{ filter: `drop-shadow(0 0 8px ${brand}60)` }}
                    onError={(e) => ((e.currentTarget.style.display = "none"))}
                  />
                </div>
                {meta.pricing && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${PRICING_STYLE[meta.pricing]}`}
                  >
                    {meta.pricing}
                  </span>
                )}
              </div>

              {/* Body: name + description */}
              <div className="relative mt-3 flex-1">
                <h3 className="text-sm font-semibold tracking-tight text-foreground md:text-base">
                  {p.name}
                </h3>
                {meta.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground/90 md:text-[13px]">
                    {meta.description}
                  </p>
                )}
                {meta.tags && meta.tags.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* External link arrow */}
              <ArrowUpRight
                aria-hidden
                className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
