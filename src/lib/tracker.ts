// Lightweight client-side tracker for streaks, course progress and learner name.
// Stored in localStorage so it works for any visitor without auth and
// stays in sync across newly added courses (CSV imports just work).

const STREAK_KEY = "lu_streak";
const LAST_VISIT_KEY = "lu_last_visit";
const COURSE_KEY = "lu_course_progress";
const NAME_KEY = "lu_name";

export const PROGRESS_STEPS = 5; // 5 visits/clicks → 100%

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function readProgressMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(COURSE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export type StreakState = { streak: number; lastDate: string | null; bumped: boolean };

/** Call on app load — increments streak if user hasn't visited today. */
export function bumpStreak(): StreakState {
  if (typeof window === "undefined") return { streak: 0, lastDate: null, bumped: false };
  try {
    const today = todayISO();
    const last = localStorage.getItem(LAST_VISIT_KEY);
    const current = Number(localStorage.getItem(STREAK_KEY) || "0");
    if (last === today) {
      return { streak: current || 1, lastDate: today, bumped: false };
    }
    const next = last === yesterdayISO() ? current + 1 : 1;
    localStorage.setItem(STREAK_KEY, String(next));
    localStorage.setItem(LAST_VISIT_KEY, today);
    return { streak: next, lastDate: today, bumped: true };
  } catch {
    return { streak: 0, lastDate: null, bumped: false };
  }
}

export function getStreak(): StreakState {
  if (typeof window === "undefined") return { streak: 0, lastDate: null, bumped: false };
  return {
    streak: Number(localStorage.getItem(STREAK_KEY) || "0"),
    lastDate: localStorage.getItem(LAST_VISIT_KEY),
    bumped: false,
  };
}

export function getCourseProgress(id: string): number {
  const m = readProgressMap();
  const c = m[id] ?? 0;
  return Math.min(100, Math.round((c / PROGRESS_STEPS) * 100));
}

export function bumpCourseProgress(id: string): number {
  if (typeof window === "undefined") return 0;
  const m = readProgressMap();
  m[id] = Math.min(PROGRESS_STEPS, (m[id] ?? 0) + 1);
  try {
    localStorage.setItem(COURSE_KEY, JSON.stringify(m));
    window.dispatchEvent(new CustomEvent("lu:progress", { detail: { id } }));
  } catch {
    /* ignore */
  }
  return Math.min(100, Math.round((m[id] / PROGRESS_STEPS) * 100));
}

export function getTotalCompleted(): number {
  const m = readProgressMap();
  return Object.values(m).filter((v) => v >= PROGRESS_STEPS).length;
}

export function getTotalStarted(): number {
  const m = readProgressMap();
  return Object.values(m).filter((v) => v > 0).length;
}

export function getName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NAME_KEY) ?? "";
}

export function setName(name: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NAME_KEY, name);
    window.dispatchEvent(new CustomEvent("lu:name", { detail: { name } }));
  } catch {
    /* ignore */
  }
}