import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OpportunityCard } from "@/components/site/OpportunityCard";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

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

const TOPIC_KEYWORDS: Record<string, string[]> = {
  coding: ["program", "programming", "code", "coding", "web", "software", "dev", "developer", "tech", "data", "python", "javascript", "react", "computer", "برمج", "تطوير", "تقني", "ويب", "بيانات"],
  languages: ["english", "french", "language", "languages", "ielts", "toefl", "spanish", "arabic", "إنجليز", "فرنس", "لغة", "لغات", "إسبان"],
  ai: ["ai", "artificial intelligence", "machine learning", "ml", "deep learning", "neural", "ذكاء", "تعلم آلي"],
  soft: ["soft", "leadership", "communication", "public speaking", "presentation", "productivity", "مهارات ناعمة", "قيادة", "تواصل", "خطابة"],
};

function Directory() {
  const { t } = useI18n();
  const TOPICS = [
    { id: "all", label: t("dir.topic.all") },
    { id: "coding", label: t("dir.topic.coding") },
    { id: "languages", label: t("dir.topic.languages") },
    { id: "ai", label: t("dir.topic.ai") },
    { id: "soft", label: t("dir.topic.soft") },
  ];
  const FORMATS = [
    { id: "all", label: t("dir.fmt.all") },
    { id: "online", label: t("dir.fmt.online") },
    { id: "in_person", label: t("dir.fmt.in_person") },
    { id: "hybrid", label: t("dir.fmt.hybrid") },
  ];
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [format, setFormat] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("category", "courses")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    const items = data ?? [];
    const needle = q.trim().toLowerCase();
    return items.filter((o) => {
      if (format !== "all" && o.format !== format) return false;
      if (topic !== "all") {
        const kws = TOPIC_KEYWORDS[topic] ?? [];
        const hay = `${o.title} ${o.description} ${o.tag ?? ""} ${o.organizer}`.toLowerCase();
        if (!kws.some((k) => hay.includes(k))) return false;
      }
      if (!needle) return true;
      return (
        o.title.toLowerCase().includes(needle) ||
        o.organizer.toLowerCase().includes(needle) ||
        (o.tag ?? "").toLowerCase().includes(needle) ||
        o.description.toLowerCase().includes(needle)
      );
    });
  }, [data, q, topic, format]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      <div className="max-w-2xl animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t("dir.title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("dir.subtitle")}</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-4 rtl:right-4" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("dir.search")}
            className="h-12 w-full rounded-2xl border border-border bg-card text-sm outline-none soft-shadow transition focus:border-primary focus:ring-2 focus:ring-primary/20 ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4"
          />
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> {t("dir.filters")}
        </button>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className={cn("space-y-6 md:block", open ? "block" : "hidden")}>
          <FilterGroup
            title={t("dir.topic")}
            options={TOPICS}
            value={topic}
            onChange={setTopic}
          />
          <FilterGroup
            title={t("dir.format")}
            options={FORMATS}
            value={format}
            onChange={setFormat}
          />
          <div className="rounded-2xl border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
            {t("dir.missing")}
          </div>
        </aside>

        <div>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl border border-border bg-card/60" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-base font-medium">{t("dir.none.title")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("dir.none.desc")}</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? t("dir.count.one") : t("dir.count.many")}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((opp, i) => (
                  <OpportunityCard key={opp.id} opp={opp} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
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