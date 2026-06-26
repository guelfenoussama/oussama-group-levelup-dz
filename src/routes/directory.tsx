import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Flame,
  ExternalLink,
  BookOpen,
  Code2,
  Sparkles,
  Languages as LanguagesIcon,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { bumpCourseProgress, getCourseProgress, bumpStreak } from "@/lib/tracker";

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

type Course = {
  name: string;
  category: "programming" | "ai" | "learningenglish" | "learningfrench" | "softskills";
  link: string;
  language: "english" | "arabic" | "french";
  price: "Free" | "Freemium";
};

const COURSES: Course[] = [
  { name: "edX", category: "programming", link: "https://www.edx.org", language: "english", price: "Freemium" },
  { name: "Coursera", category: "programming", link: "https://www.coursera.org", language: "english", price: "Freemium" },
  { name: "Khan Academy", category: "programming", link: "https://www.khanacademy.org", language: "english", price: "Freemium" },
  { name: "Harmash", category: "programming", link: "https://harmash.com/", language: "arabic", price: "Freemium" },
  { name: "freeCodeCamp", category: "programming", link: "https://www.freecodecamp.org", language: "english", price: "Freemium" },
  { name: "The Odin Project", category: "programming", link: "https://www.theodinproject.com", language: "english", price: "Freemium" },
  { name: "Scrimba", category: "programming", link: "https://scrimba.com", language: "english", price: "Freemium" },
  { name: "Udacity", category: "programming", link: "https://www.udacity.com", language: "english", price: "Freemium" },
  { name: "W3Schools", category: "programming", link: "https://www.w3schools.com/", language: "english", price: "Free" },
  { name: "Kaggle Learn", category: "ai", link: "https://www.kaggle.com/learn", language: "english", price: "Free" },
  { name: "Fast.ai", category: "ai", link: "https://www.fast.ai", language: "english", price: "Freemium" },
  { name: "Satr", category: "ai", link: "https://satr.codes/", language: "arabic", price: "Free" },
  { name: "Elzero Web School", category: "programming", link: "https://elzero.org/", language: "arabic", price: "Free" },
  { name: "Octocode", category: "programming", link: "https://octocode.io/", language: "arabic", price: "Freemium" },
  { name: "Hsoub Academy", category: "programming", link: "https://academy.hsoub.com/", language: "arabic", price: "Freemium" },
  { name: "ZAmericanEnglish", category: "learningenglish", link: "https://www.zamericanenglish.com/", language: "arabic", price: "Freemium" },
  { name: "Taleek", category: "learningenglish", link: "https://taleek.com/", language: "arabic", price: "Freemium" },
  { name: "Droos Online", category: "learningenglish", link: "https://droosonline.com/", language: "arabic", price: "Freemium" },
  { name: "Duolingo", category: "learningenglish", link: "https://ar.duolingo.com/", language: "arabic", price: "Free" },
  { name: "British Council - LearnEnglish", category: "learningenglish", link: "https://learnenglish.britishcouncil.org/", language: "english", price: "Free" },
  { name: "Introduction to Public Speaking", category: "softskills", link: "https://www.coursera.org/", language: "english", price: "Freemium" },
  { name: "How to Use SMART Goals: Achieve More in Less Time", category: "softskills", link: "https://www.udemy.com/", language: "english", price: "Free" },
  { name: "Diploma in Interpersonal Skills", category: "softskills", link: "https://alison.com/", language: "english", price: "Free" },
  { name: "Personal Branding for Career Success", category: "softskills", link: "https://www.open.edu/openlearn/", language: "english", price: "Freemium" },
  { name: "Critical Thinking at University", category: "softskills", link: "https://www.futurelearn.com/", language: "english", price: "Freemium" },
  { name: "Working in Diverse Teams", category: "softskills", link: "https://www.open.edu/openlearn/", language: "english", price: "Free" },
  { name: "The Science of Well-Being", category: "softskills", link: "https://www.coursera.org/", language: "english", price: "Freemium" },
  { name: "Leading With Effective Communication", category: "softskills", link: "https://www.edx.org/", language: "english", price: "Freemium" },
  { name: "مهارات التواصل الفعال", category: "softskills", link: "https://www.edraak.org/", language: "arabic", price: "Free" },
  { name: "السيرة الذاتية والمقابلة الوظيفية", category: "softskills", link: "https://www.rwaq.org/", language: "arabic", price: "Free" },
  { name: "مهارات تنظيم وإدارة الوقت", category: "softskills", link: "https://satr.codes/", language: "arabic", price: "Free" },
  { name: "مهارات حل المشكلات واتخاذ القرارات", category: "softskills", link: "https://www.rwaq.org/", language: "arabic", price: "Free" },
  { name: "Duolingo French", category: "learningfrench", link: "https://ar.duolingo.com/", language: "arabic", price: "Freemium" },
  { name: "Busuu French", category: "learningfrench", link: "https://www.busuu.com/ar", language: "arabic", price: "Freemium" },
  { name: "RFI Savoirs", category: "learningfrench", link: "https://francaisfacile.rfi.fr/ar/", language: "french", price: "Free" },
  { name: "Taleek French", category: "learningfrench", link: "https://taleek.com/", language: "arabic", price: "Freemium" },
];

const CATEGORY_LABEL: Record<Course["category"], string> = {
  programming: "Programming",
  ai: "Artificial Intelligence",
  learningenglish: "English",
  learningfrench: "French",
  softskills: "Soft Skills",
};

const CATEGORY_ICON: Record<Course["category"], typeof Code2> = {
  programming: Code2,
  ai: Sparkles,
  learningenglish: LanguagesIcon,
  learningfrench: LanguagesIcon,
  softskills: GraduationCap,
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
          <FilterGroup title="Category" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
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
  const Icon = CATEGORY_ICON[course.category];
  const isArabic = course.language === "arabic";
  const isFree = course.price === "Free";

  const handleStart = () => {
    setProgress(bumpCourseProgress(id));
  };

  return (
    <article
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 soft-shadow card-lift animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
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
            style={{ width: `${progress}%`, background: "var(--brand-gradient)" }}
          />
        </div>
      </div>

      <a
        href={course.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleStart}
        className="btn-pop mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-95"
      >
        {progress > 0 ? "Go to Course" : "Start Learning"}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </article>
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