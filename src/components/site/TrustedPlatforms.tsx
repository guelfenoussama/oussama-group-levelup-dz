import { FEATURED_PLATFORMS } from "@/lib/courses";
import { useI18n } from "@/lib/i18n";

type PlatformMeta = {
  slug: string; // simpleicons slug
  color: string; // brand hex without #
  span?: string; // grid span classes for bento layout
};

const META: Record<string, PlatformMeta> = {
  Coursera: { slug: "coursera", color: "0056D2", span: "md:col-span-2 md:row-span-2" },
  edX: { slug: "edx", color: "02262B" },
  freeCodeCamp: { slug: "freecodecamp", color: "0A0A23", span: "md:row-span-2" },
  "Khan Academy": { slug: "khanacademy", color: "14BF96" },
  Udacity: { slug: "udacity", color: "02B3E4" },
  Kaggle: { slug: "kaggle", color: "20BEFF", span: "md:col-span-2" },
  "British Council": { slug: "britishcouncil", color: "E4032E" },
  Duolingo: { slug: "duolingo", color: "58CC02" },
  "The Odin Project": { slug: "theodinproject", color: "CF4A29", span: "md:col-span-2" },
  Scrimba: { slug: "scrimba", color: "2B283A" },
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

      <div className="mt-10 grid auto-rows-[7rem] grid-cols-2 gap-4 sm:gap-5 md:mt-12 md:grid-cols-4 md:gap-6">
        {FEATURED_PLATFORMS.map((p, i) => {
          const meta = META[p.name] ?? { slug: p.name.toLowerCase().replace(/\s+/g, ""), color: "72E0D0" };
          const brand = `#${meta.color}`;
          const logo = `https://cdn.simpleicons.org/${meta.slug}/ffffff`;
          const logoHover = `https://cdn.simpleicons.org/${meta.slug}/${meta.color}`;
          return (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:border-white/25 animate-fade-up ${meta.span ?? ""}`}
              style={{
                animationDelay: `${i * 60}ms`,
                backgroundImage: `linear-gradient(140deg, ${brand}14 0%, transparent 55%), linear-gradient(315deg, ${brand}0d 0%, transparent 60%)`,
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.06)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 20px 50px -20px ${brand}66, inset 0 1px 0 0 rgba(255,255,255,0.1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `inset 0 1px 0 0 rgba(255,255,255,0.06)`;
              }}
            >
              {/* Glowing border sheen */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(60% 80% at 50% 0%, ${brand}22, transparent 70%)`,
                }}
              />
              {/* Corner accent */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl transition-all duration-500 group-hover:w-1"
                style={{ background: `linear-gradient(180deg, ${brand}, transparent)` }}
              />
              <span
                aria-hidden
                className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover:scale-150"
                style={{ background: brand, boxShadow: `0 0 12px ${brand}` }}
              />

              {/* Logo */}
              <div className="relative flex h-10 w-10 items-center justify-center md:h-12 md:w-12">
                <img
                  src={logo}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-contain opacity-70 transition-opacity duration-500 group-hover:opacity-0"
                  onError={(e) => ((e.currentTarget.style.display = "none"))}
                />
                <img
                  src={logoHover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ filter: `drop-shadow(0 0 10px ${brand}80)` }}
                  onError={(e) => ((e.currentTarget.style.display = "none"))}
                />
              </div>
              <span className="mt-3 text-center text-xs font-semibold tracking-tight text-muted-foreground transition-colors duration-300 group-hover:text-foreground md:text-sm">
                {p.name}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
