import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Flame,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { bumpCourseProgress, getCourseProgress, bumpStreak } from "@/lib/tracker";
import { COURSES, type Course } from "@/lib/courses";
import { CATEGORY_THEME, categoryStyle } from "@/lib/categoryTheme";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      { title: "Courses Directory — LevelUp DZ" },
      { name: "description", content: "Search and filter courses in programming, languages, AI and soft skills for Algerian students." },
      { property: "og:title", content: "Courses Directory — LevelUp DZ" },
      { property: "og:description", content: "Search and filter courses in programming, languages, AI and soft skills for Algerian students." },
    ],
  }),
  component: Directory,
});

const CATEGORY_LABEL: Record<Course["category"], string> = {
  programming: "Programming",
  ai: "Artificial Intelligence",
  learningenglish: "English",
  learningfrench: "French",
  softskills: "Soft Skills",
};

const LANGUAGE_LABEL: Record<Course["language"], string> = {
  english: "English",
  arabic: "Arabic",
  french: "French",
};

const LANGUAGE_FLAG: Record<Course["language"], string> = {
  english: "🇬🇧",
  arabic: "🇸🇦",
  french: "🇫🇷",
};

function courseId(c: Course): string {
  return `${c.category}:${c.name}`;
}

function Directory() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<"all" | Course["category"]>("all");
  const [language, setLanguage] = useState<"all" | Course["language"]>("all");
  const [price, setPrice] = useState<"all" | Course["price"]>("all");
  const [open, setOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(bumpStreak().streak);
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return COURSES.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (language !== "all" && c.language !== language) return false;
      if (price !== "all" && c.price !== price) return false;
      if (!needle) return true;
      return c.name.toLowerCase().includes(needle);
    });
  }, [q, category, language, price]);

  const CATEGORY_OPTIONS: { id: "all" | Course["category"]; label: string }[] = [
    { id: "all", label: "All" },
    { id: "programming", label: CATEGORY_LABEL.programming },
    { id: "ai", label: CATEGORY_LABEL.ai },
    { id: "learningenglish", label: CATEGORY_LABEL.learningenglish },
    { id: "learningfrench", label: CATEGORY_LABEL.learningfrench },
    { id: "softskills", label: CATEGORY_LABEL.softskills },
  ];
  const LANGUAGE_OPTIONS: { id: "all" | Course["language"]; label: string }[] = [
    { id: "all", label: "All" },
    { id: "english", label: `${LANGUAGE_FLAG.english} English` },
    { id: "arabic", label: `${LANGUAGE_FLAG.arabic} Arabic` },
    { id: "french", label: `${LANGUAGE_FLAG.french} French` },
  ];
  const PRICE_OPTIONS: { id: "all" | Course["price"]; label: string }[] = [
    { id: "all", label: "All" },
    { id: "Free", label: "Free" },
    { id: "Freemium", label: "Freemium" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t("dir.title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("dir.subtitle")}</p>
        </div>
        <div className="inline-flex items-center gap-3 self-start rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium soft-shadow">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10">
            <Flame className="h-5 w-5 text-primary" />
          </span>
          <div className="leading-tight">
            <div className="text-foreground">{streak} {streak === 1 ? "day" : "days"} streak 🔥</div>
            <div className="text-xs text-muted-foreground">Keep the flame burning</div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-4 rtl:right-4" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses by name…"
            className="h-12 w-full rounded-2xl border border-border bg-card text-sm outline-none soft-shadow transition focus:border-primary focus:ring-2 focus:ring-primary/20 ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4"
          />
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className={cn("space-y-6 md:block", open ? "block" : "hidden")}>
          <CategoryFilter value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
          <FilterGroup title="Language" options={LANGUAGE_OPTIONS} value={language} onChange={setLanguage} />
          <FilterGroup title="Price" options={PRICE_OPTIONS} value={price} onChange={setPrice} />
        </aside>

        <div>
          <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "course" : "courses"}
          </p>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-base font-medium">No courses match</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((c, i) => (
                <CourseCard key={courseId(c)} course={c} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const id = courseId(course);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(getCourseProgress(id));
  }, [id]);
  const theme = CATEGORY_THEME[course.category];
  const Icon = theme.icon;
  const isArabic = course.language === "arabic";
  const isFree = course.price === "Free";

  const handleStart = () => {
    setProgress(bumpCourseProgress(id));
  };

  return (
    <article
      className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 soft-shadow card-lift animate-fade-up transition-colors hover:border-[color-mix(in_oklab,var(--cat)_45%,transparent)]"
      style={{
        ...categoryStyle(course.category),
        animationDelay: `${Math.min(index * 40, 320)}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl transition-all duration-300 group-hover:scale-110"
          style={{
            background: "color-mix(in oklab, var(--cat) 15%, transparent)",
            color: "var(--cat)",
            boxShadow: "0 0 0 1px color-mix(in oklab, var(--cat) 25%, transparent), 0 8px 24px -12px color-mix(in oklab, var(--cat) 55%, transparent)",
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
            isFree
              ? "bg-[oklch(0.93_0.08_150)] text-[oklch(0.35_0.12_150)]"
              : "bg-[oklch(0.93_0.06_280)] text-[oklch(0.38_0.14_280)]",
          )}
        >
          {course.price}
        </span>
      </div>
      <h3
        className="mt-4 text-base font-semibold leading-snug tracking-tight"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {course.name}
      </h3>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5">
          <BookOpen className="h-3 w-3" /> {CATEGORY_LABEL[course.category]}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5">
          <span aria-hidden>{LANGUAGE_FLAG[course.language]}</span> {LANGUAGE_LABEL[course.language]}
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--cat), var(--cat-soft))",
            }}
          />
        </div>
      </div>

      <a
        href={course.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleStart}
        className="btn-pop mt-5 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[oklch(0.14_0.02_250)] hover:opacity-95"
        style={{
          background: "linear-gradient(135deg, var(--cat), var(--cat-soft))",
          boxShadow: "0 8px 22px -10px color-mix(in oklab, var(--cat) 65%, transparent)",
        }}
      >
        {progress > 0 ? "Go to Course" : "Start Learning"}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}

function CategoryFilter({
  value,
  onChange,
  options,
}: {
  value: "all" | Course["category"];
  onChange: (v: "all" | Course["category"]) => void;
  options: ReadonlyArray<{ id: "all" | Course["category"]; label: string }>;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Category
      </h3>
      <div className="flex flex-col gap-1">
        {options.map((o) => {
          const theme = o.id === "all" ? null : CATEGORY_THEME[o.id];
          const Icon = theme?.icon ?? BookOpen;
          const active = value === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              className={cn(
                "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              style={
                active
                  ? {
                      background: theme
                        ? "color-mix(in oklab, var(--tmp) 18%, transparent)"
                        : undefined,
                      boxShadow: theme
                        ? "inset 0 0 0 1px color-mix(in oklab, var(--tmp) 35%, transparent)"
                        : undefined,
                      ["--tmp" as string]: theme?.color,
                    }
                  : undefined
              }
            >
              <span
                className="grid h-6 w-6 place-items-center rounded-md transition-transform group-hover:scale-110"
                style={{
                  background: theme ? "color-mix(in oklab, var(--ic) 18%, transparent)" : "transparent",
                  color: theme ? "var(--ic)" : "inherit",
                  ["--ic" as string]: theme?.color,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: ReadonlyArray<{ id: T; label: string }>;
  value: string;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
              value === o.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}