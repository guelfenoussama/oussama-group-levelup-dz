import { useEffect, useState } from "react";
import { Flame, Sparkles, Pencil, Check, BookOpen, Trophy } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  bumpStreak,
  getName,
  setName as saveName,
  getTotalCompleted,
  getTotalStarted,
} from "@/lib/tracker";

function pickMessage(t: (k: string) => string, streak: number, name: string): string {
  const who = name ? `, ${name}` : "";
  if (streak >= 7) return t("streak.msg.fire").replace("{name}", who);
  if (streak >= 3) return t("streak.msg.keep").replace("{name}", who);
  if (streak >= 1) return t("streak.msg.great").replace("{name}", who);
  return t("streak.msg.start").replace("{name}", who);
}

export function StreakWidget() {
  const { t } = useI18n();
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [started, setStarted] = useState(0);
  const [name, setLocalName] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const s = bumpStreak();
    setStreak(s.streak);
    setLocalName(getName());
    setCompleted(getTotalCompleted());
    setStarted(getTotalStarted());
    const onProgress = () => {
      setCompleted(getTotalCompleted());
      setStarted(getTotalStarted());
    };
    const onName = () => setLocalName(getName());
    window.addEventListener("lu:progress", onProgress);
    window.addEventListener("lu:name", onName);
    return () => {
      window.removeEventListener("lu:progress", onProgress);
      window.removeEventListener("lu:name", onName);
    };
  }, []);

  const commit = () => {
    const v = draft.trim().slice(0, 30);
    saveName(v);
    setLocalName(v);
    setEditing(false);
  };

  return (
    <section className="mx-auto max-w-7xl px-5">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 soft-shadow md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 opacity-70"
          style={{
            background:
              "radial-gradient(50% 80% at 100% 0%, oklch(0.78 0.16 60 / 0.25), transparent 70%), radial-gradient(50% 80% at 0% 100%, oklch(0.7 0.14 185 / 0.18), transparent 70%)",
          }}
        />
        <div className="relative grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
          {/* Streak */}
          <div className="flex items-center gap-4">
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-[oklch(0.96_0.07_60)] dark:bg-[oklch(0.3_0.08_60)]">
              <Flame className="h-7 w-7 text-[oklch(0.55_0.2_40)] dark:text-[oklch(0.78_0.18_55)]" />
              <span className="absolute -bottom-1 -right-1 grid h-6 min-w-6 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground shadow">
                {streak}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("streak.label")}
              </p>
              <p className="text-2xl font-semibold leading-tight tracking-tight">
                {streak} {streak === 1 ? t("streak.day") : t("streak.days")} 🔥
              </p>
            </div>
          </div>

          {/* Motivational copy + name */}
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {t("streak.coach")}
            </p>
            <p className="mt-1 text-base font-medium leading-snug text-foreground md:text-lg">
              {pickMessage(t, streak, name)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {editing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    commit();
                  }}
                  className="inline-flex items-center gap-1.5"
                >
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={t("streak.name.placeholder")}
                    className="h-7 w-40 rounded-full border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    maxLength={30}
                  />
                  <button
                    type="submit"
                    aria-label="Save"
                    className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setDraft(name);
                    setEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <Pencil className="h-3 w-3" />
                  {name ? t("streak.name.change") : t("streak.name.set")}
                </button>
              )}
            </div>
          </div>

          {/* Mini stats */}
          <div className="flex gap-3">
            <div className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-center">
              <BookOpen className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-lg font-semibold leading-none">{started}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("streak.started")}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-center">
              <Trophy className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-lg font-semibold leading-none">{completed}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("streak.completed")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}