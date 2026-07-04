import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Flame, Trophy, Clock, BookOpen, CheckCircle2, Zap, Sparkles,
  Calendar as CalendarIcon, Target, TrendingUp, Award, Plus, ArrowRight,
} from "lucide-react";
import {
  consumeCelebrations, getJourney, heatmap, journeyStats, last7Days,
  logLearning, todayStatus, type Journey, type Milestone,
} from "@/lib/tracker";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Your Learning Journey — LevelUp DZ" },
      { name: "description", content: "Track your daily learning streak, XP, milestones and progress across every course you take on LevelUp DZ." },
      { property: "og:title", content: "Your Learning Journey — LevelUp DZ" },
      { property: "og:description", content: "Streaks, XP, milestones and a GitHub-style heatmap of your learning consistency." },
    ],
  }),
  component: JourneyPage,
});

/* ------------------------------ helpers ------------------------------ */

const MILESTONE_META: Record<Milestone, { title: string; desc: string; icon: typeof Trophy }> = {
  first_day: { title: "First learning day", desc: "The journey has officially begun.", icon: Sparkles },
  streak_7: { title: "7-day streak", desc: "A full week of consistent learning.", icon: Flame },
  streak_30: { title: "30-day streak", desc: "Discipline earned — a full month.", icon: Trophy },
  hours_100: { title: "100 learning hours", desc: "Deep work compounds. Look at you go.", icon: Clock },
  first_course: { title: "First course completed", desc: "One down. Momentum unlocked.", icon: CheckCircle2 },
  five_courses: { title: "Five courses completed", desc: "You're building a real skill portfolio.", icon: Award },
};

function motivation(s: ReturnType<typeof journeyStats>, status: string): string {
  if (status === "pending" && s.currentStreak === 0) return "Start with one small check-in — that's how habits begin.";
  if (status === "pending" && s.currentStreak >= 1) return `Don't break the chain — ${s.currentStreak}-day streak is on the line today.`;
  if (s.currentStreak === 6) return "Only one day left to reach a 7-day streak.";
  if (s.currentStreak === 29) return "One more day and you unlock the 30-day milestone.";
  if (s.currentStreak >= 30) return "You're in rare company. Consistency beats intensity.";
  if (s.currentStreak >= 7) return "You're building a great habit — keep it lightweight and daily.";
  return "Progress, not perfection. Small daily reps compound.";
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ------------------------------ atoms ------------------------------ */

function ProgressRing({ pct, size = 132, stroke = 10, children }: { pct: number; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(pct));
    return () => cancelAnimationFrame(raf);
  }, [pct]);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-white/[0.06]" />
        <circle
          cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} strokeLinecap="round"
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-[1200ms] ease-out"
          strokeDasharray={c} strokeDashoffset={c - (c * animated) / 100}
          style={{ filter: "drop-shadow(0 0 10px oklch(0.72 0.11 185 / 0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

function CountNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (to - from) * eased * 10) / 10);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  const display = Number.isInteger(value) ? Math.round(n) : n;
  return <span className="tabular-nums">{display}{suffix}</span>;
}

function Confetti({ show, onDone }: { show: boolean; onDone: () => void }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [show, onDone]);
  if (!show) return null;
  const pieces = Array.from({ length: 60 });
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const dur = 1.6 + Math.random() * 1.2;
        const rot = Math.random() * 360;
        const colors = ["#72E0D0", "#F5B547", "#8B5CF6", "#22C55E", "#F472B6"];
        const bg = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute -top-4 block h-2.5 w-1.5 rounded-sm"
            style={{
              left: `${left}%`,
              background: bg,
              transform: `rotate(${rot}deg)`,
              animation: `lu-confetti ${dur}s cubic-bezier(0.2, 0.7, 0.3, 1) ${delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------ sections ------------------------------ */

function TodayCard({ status, streak, onCheckin }: { status: "completed" | "streak" | "pending"; streak: number; onCheckin: () => void }) {
  const meta = status === "pending"
    ? { label: "Not completed yet", icon: "⏳", tone: "text-amber-300 bg-amber-500/10 border-amber-400/20" }
    : status === "streak"
    ? { label: "Streak active", icon: "🔥", tone: "text-orange-300 bg-orange-500/10 border-orange-400/20" }
    : { label: "Completed today", icon: "✅", tone: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20" };
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 backdrop-blur-xl animate-fade-in">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{ background: "radial-gradient(60% 90% at 100% 0%, oklch(0.72 0.11 185 / 0.18), transparent 70%)" }} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's check-in</p>
          <div className="mt-2 flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.tone}`}>
              <span>{meta.icon}</span> {meta.label}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-400" /> {streak}-day streak
            </span>
          </div>
        </div>
        <button
          onClick={onCheckin}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.11_185/0.6)] transition-all hover:-translate-y-0.5 hover:opacity-95"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          Log 10 min of learning
        </button>
      </div>
    </div>
  );
}

function WeeklyCalendar({ days }: { days: ReturnType<typeof last7Days> }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">This week</p>
          <h3 className="mt-1 text-base font-semibold">7-day check-ins</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> done</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-400" /> today</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/10" /> missed</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const done = !!d.activity;
          const bg = d.isToday && !done
            ? "bg-sky-500/15 border-sky-400/40 text-sky-300"
            : done
            ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
            : "bg-white/[0.02] border-white/10 text-muted-foreground";
          const label = new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" });
          const tip = done
            ? `${d.activity!.minutes} min · ${d.activity!.courses.length} course${d.activity!.courses.length === 1 ? "" : "s"}`
            : d.isToday
            ? "Today — no check-in yet"
            : "No activity";
          return (
            <div key={d.date} className="group relative">
              <div className={`flex aspect-square flex-col items-center justify-center rounded-xl border transition-transform group-hover:-translate-y-0.5 ${bg}`}>
                <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">{label}</span>
                <span className="mt-0.5 text-lg font-semibold tabular-nums">{new Date(d.date + "T00:00:00").getDate()}</span>
              </div>
              <div className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2.5 py-1 text-[11px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {tip}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatsGrid({ s }: { s: ReturnType<typeof journeyStats> }) {
  const items = [
    { label: "Current streak", value: s.currentStreak, suffix: "d", icon: Flame, tint: "text-orange-300" },
    { label: "Longest streak", value: s.longestStreak, suffix: "d", icon: TrendingUp, tint: "text-fuchsia-300" },
    { label: "Learning days", value: s.learningDays, icon: CalendarIcon, tint: "text-sky-300" },
    { label: "Learning hours", value: s.totalHours, suffix: "h", icon: Clock, tint: "text-emerald-300" },
    { label: "Courses completed", value: s.coursesCompleted, icon: Trophy, tint: "text-amber-300" },
    { label: "Lessons completed", value: s.lessonsCompleted, icon: BookOpen, tint: "text-primary" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {items.map((it, i) => (
        <div
          key={it.label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-transform hover:-translate-y-0.5 hover:border-white/20 animate-fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <it.icon className={`h-3.5 w-3.5 ${it.tint}`} /> {it.label}
          </div>
          <p className="mt-2 text-2xl font-semibold leading-none">
            <CountNumber value={it.value} suffix={it.suffix ?? ""} />
          </p>
        </div>
      ))}
    </div>
  );
}

function Heatmap({ data }: { data: { date: string; minutes: number }[] }) {
  // build columns of 7 (weeks)
  const weeks: { date: string; minutes: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));
  const level = (m: number) => {
    if (m <= 0) return "bg-white/[0.04]";
    if (m < 15) return "bg-primary/20";
    if (m < 30) return "bg-primary/40";
    if (m < 60) return "bg-primary/70";
    return "bg-primary";
  };
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Consistency</p>
          <h3 className="mt-1 text-base font-semibold">Learning heatmap</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          less
          <span className="mx-1 flex items-center gap-0.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-white/[0.04]" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-primary/20" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-primary/40" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-primary/70" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-primary" />
          </span>
          more
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((d) => (
                <div key={d.date} className="group relative">
                  <div className={`h-3 w-3 rounded-[3px] ${level(d.minutes)} transition-transform group-hover:scale-125`} />
                  <div className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {formatDate(d.date)} · {d.minutes} min
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Milestones({ unlocked }: { unlocked: Milestone[] }) {
  const keys = Object.keys(MILESTONE_META) as Milestone[];
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl animate-fade-in">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Milestones</p>
      <h3 className="mt-1 text-base font-semibold">Achievements</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {keys.map((k) => {
          const m = MILESTONE_META[k];
          const isUnlocked = unlocked.includes(k);
          return (
            <div
              key={k}
              className={`flex items-start gap-3 rounded-2xl border p-3 transition-all ${
                isUnlocked
                  ? "border-primary/30 bg-primary/[0.06] shadow-[0_10px_30px_-15px_oklch(0.72_0.11_185/0.5)]"
                  : "border-white/10 bg-white/[0.02] opacity-60"
              }`}
            >
              <div className={`grid h-10 w-10 flex-none place-items-center rounded-xl ${isUnlocked ? "bg-primary/15 text-primary" : "bg-white/[0.04] text-muted-foreground"}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
              {isUnlocked && <CheckCircle2 className="ml-auto h-4 w-4 flex-none text-primary" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function XPPanel({ s }: { s: ReturnType<typeof journeyStats> }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl animate-fade-in">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="flex items-center gap-5">
        <ProgressRing pct={s.pct}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Level</p>
            <p className="text-3xl font-semibold leading-none"><CountNumber value={s.level} /></p>
          </div>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
            <Zap className="h-3.5 w-3.5" /> {s.xp.toLocaleString()} XP
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {s.span - s.into} XP to Level {s.level + 1}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out" style={{ width: `${s.pct}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2">
              <p className="text-[10px] uppercase tracking-wider">Completion</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground"><CountNumber value={s.completionPct} suffix="%" /></p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2">
              <p className="text-[10px] uppercase tracking-wider">Started</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground"><CountNumber value={s.coursesStarted} /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ page ------------------------------ */

function useJourneyState() {
  const [journey, setJourney] = useState<Journey>(() => (typeof window === "undefined" ? getJourney() : getJourney()));
  useEffect(() => {
    const sync = () => setJourney(getJourney());
    sync();
    window.addEventListener("lu:journey", sync);
    window.addEventListener("lu:progress", sync);
    return () => {
      window.removeEventListener("lu:journey", sync);
      window.removeEventListener("lu:progress", sync);
    };
  }, []);
  return [journey, setJourney] as const;
}

function JourneyPage() {
  const [, setJourney] = useJourneyState();
  const stats = useMemo(() => journeyStats(), []);
  const [statsView, setStatsView] = useState(stats);
  const [status, setStatus] = useState<"completed" | "streak" | "pending">("pending");
  const [days, setDays] = useState(last7Days());
  const [heat, setHeat] = useState(heatmap());
  const [unlocked, setUnlocked] = useState<Milestone[]>([]);
  const [celebration, setCelebration] = useState<Milestone | null>(null);

  useEffect(() => {
    const refresh = () => {
      const j = getJourney();
      setStatsView(journeyStats());
      setStatus(todayStatus());
      setDays(last7Days());
      setHeat(heatmap());
      setUnlocked(j.milestones);
      const pending = consumeCelebrations();
      if (pending.length) setCelebration(pending[pending.length - 1]);
    };
    refresh();
    const onSync = () => refresh();
    window.addEventListener("lu:journey", onSync);
    window.addEventListener("lu:progress", onSync);
    return () => {
      window.removeEventListener("lu:journey", onSync);
      window.removeEventListener("lu:progress", onSync);
    };
  }, []);

  const onCheckin = () => {
    logLearning({ minutes: 10 });
    setJourney(getJourney());
  };

  const msg = motivation(statsView, status);
  const celebMeta = celebration ? MILESTONE_META[celebration] : null;

  return (
    <main className="relative">
      <Confetti show={!!celebration} onDone={() => setCelebration(null)} />

      {/* header */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{ background: "radial-gradient(50% 60% at 50% 0%, oklch(0.72 0.11 185 / 0.18), transparent 70%)" }} />
        <div className="mx-auto max-w-6xl px-5 pt-14 pb-8 md:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-muted-foreground">
                <Target className="h-3.5 w-3.5 text-primary" /> Learning journey
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Your consistency, <span className="brand-gradient-text">visualized</span>.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{msg}</p>
            </div>
            <Link
              to="/directory"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/[0.06]"
            >
              Browse courses <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* body */}
      <section className="mx-auto max-w-6xl space-y-6 px-5 pb-24">
        <TodayCard status={status} streak={statsView.currentStreak} onCheckin={onCheckin} />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <WeeklyCalendar days={days} />
          <XPPanel s={statsView} />
        </div>

        <StatsGrid s={statsView} />

        <Heatmap data={heat} />

        <Milestones unlocked={unlocked} />
      </section>

      {/* achievement modal */}
      {celebMeta && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-black/60 backdrop-blur-sm" onClick={() => setCelebration(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl border border-primary/30 bg-[oklch(0.14_0.02_240)] p-8 text-center shadow-[0_30px_80px_-20px_oklch(0.72_0.11_185/0.5)] animate-fade-in"
          >
            <div aria-hidden className="pointer-events-none absolute -inset-1 -z-10 opacity-60"
              style={{ background: "radial-gradient(50% 60% at 50% 0%, oklch(0.72 0.11 185 / 0.4), transparent 70%)" }} />
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary">
              <celebMeta.icon className="h-8 w-8" />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Achievement unlocked</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">{celebMeta.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{celebMeta.desc}</p>
            <button
              onClick={() => setCelebration(null)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Keep going
            </button>
          </div>
        </div>
      )}
    </main>
  );
}