import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OpportunityCard } from "@/components/site/OpportunityCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      { title: "Opportunities Directory — LevelUp DZ" },
      { name: "description", content: "Search and filter summer courses, competitions and volunteering for Algerian students." },
      { property: "og:title", content: "Opportunities Directory — LevelUp DZ" },
      { property: "og:description", content: "Search and filter summer courses, competitions and volunteering for Algerian students." },
    ],
  }),
  component: Directory,
});

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "courses", label: "📚 Courses" },
  { id: "competitions", label: "🏆 Competitions" },
  { id: "volunteering", label: "🤝 Volunteering" },
] as const;

const FORMATS = [
  { id: "all", label: "Any format" },
  { id: "online", label: "Online" },
  { id: "in_person", label: "In-person" },
  { id: "hybrid", label: "Hybrid" },
] as const;

function Directory() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [format, setFormat] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    const items = data ?? [];
    const needle = q.trim().toLowerCase();
    return items.filter((o) => {
      if (category !== "all" && o.category !== category) return false;
      if (format !== "all" && o.format !== format) return false;
      if (!needle) return true;
      return (
        o.title.toLowerCase().includes(needle) ||
        o.organizer.toLowerCase().includes(needle) ||
        (o.tag ?? "").toLowerCase().includes(needle) ||
        o.description.toLowerCase().includes(needle)
      );
    });
  }, [data, q, category, format]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      <div className="max-w-2xl animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Opportunities Directory</h1>
        <p className="mt-3 text-muted-foreground">
          A curated collection updated for Algerian students. Filter by category and format,
          then apply directly from the card.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, organizer, tag…"
            className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none soft-shadow transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
          <FilterGroup
            title="Category"
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
          />
          <FilterGroup
            title="Format"
            options={FORMATS}
            value={format}
            onChange={setFormat}
          />
          <div className="rounded-2xl border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
            Found a missing opportunity? Email us — we'll add it to the directory.
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
              <p className="text-base font-medium">No opportunities match these filters.</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different category or clear your search.</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"}
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