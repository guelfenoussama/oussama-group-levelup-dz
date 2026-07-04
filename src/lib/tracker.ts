// Lightweight client-side tracker for the "Learning Journey" experience.
// Everything is stored in localStorage so it works without auth. A single
// versioned JSON blob holds streak, XP, per-day activity and milestones;
// legacy keys are still read for one-time migration.

const STREAK_KEY = "lu_streak";
const LAST_VISIT_KEY = "lu_last_visit";
const COURSE_KEY = "lu_course_progress";
const NAME_KEY = "lu_name";
const JOURNEY_KEY = "lu_journey_v1";

export const PROGRESS_STEPS = 5; // 5 meaningful actions → 100%

/** Minutes credited when the user opens a course card (implicit session). */
const IMPLICIT_MINUTES = 10;
/** XP awarded for each meaningful check-in / course click. */
const XP_PER_CHECKIN = 10;
const XP_PER_MINUTE = 1;
const XP_COURSE_START = 20;
const XP_COURSE_COMPLETE = 100;
const XP_DAILY_STREAK_BONUS = 5;

export type DayActivity = { minutes: number; courses: string[]; lessons: number };

export type Milestone =
  | "first_day"
  | "streak_7"
  | "streak_30"
  | "hours_100"
  | "first_course"
  | "five_courses";

export type Journey = {
  streak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  days: Record<string, DayActivity>;
  courseProgress: Record<string, number>;
  completedCourseIds: string[];
  xp: number;
  milestones: Milestone[];
  pendingCelebrations: Milestone[];
};

const EMPTY: Journey = {
  streak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  days: {},
  courseProgress: {},
  completedCourseIds: [],
  xp: 0,
  milestones: [],
  pendingCelebrations: [],
};

function isoDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, delta: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return isoDate(d);
}

function readJourney(): Journey {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<Journey>) };
  } catch {
    /* ignore */
  }
  // one-time migration from legacy keys
  const migrated: Journey = { ...EMPTY };
  try {
    const s = Number(localStorage.getItem(STREAK_KEY) || "0");
    if (s > 0) {
      migrated.streak = s;
      migrated.longestStreak = s;
      migrated.lastCompletedDate = localStorage.getItem(LAST_VISIT_KEY);
    }
    const raw = localStorage.getItem(COURSE_KEY);
    if (raw) {
      migrated.courseProgress = JSON.parse(raw) as Record<string, number>;
      migrated.completedCourseIds = Object.entries(migrated.courseProgress)
        .filter(([, v]) => v >= PROGRESS_STEPS)
        .map(([k]) => k);
    }
  } catch {
    /* ignore */
  }
  return migrated;
}

function writeJourney(j: Journey) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(j));
    // Keep legacy mirror so existing widgets stay in sync.
    localStorage.setItem(STREAK_KEY, String(j.streak));
    if (j.lastCompletedDate) localStorage.setItem(LAST_VISIT_KEY, j.lastCompletedDate);
    localStorage.setItem(COURSE_KEY, JSON.stringify(j.courseProgress));
    window.dispatchEvent(new CustomEvent("lu:journey"));
  } catch {
    /* ignore */
  }
}

function evaluateMilestones(j: Journey) {
  const totalHours = Object.values(j.days).reduce((a, d) => a + d.minutes, 0) / 60;
  const learningDays = Object.keys(j.days).length;
  const completedCourses = j.completedCourseIds.length;

  const unlocks: Milestone[] = [];
  const has = (m: Milestone) => j.milestones.includes(m);
  if (learningDays >= 1 && !has("first_day")) unlocks.push("first_day");
  if (j.streak >= 7 && !has("streak_7")) unlocks.push("streak_7");
  if (j.streak >= 30 && !has("streak_30")) unlocks.push("streak_30");
  if (totalHours >= 100 && !has("hours_100")) unlocks.push("hours_100");
  if (completedCourses >= 1 && !has("first_course")) unlocks.push("first_course");
  if (completedCourses >= 5 && !has("five_courses")) unlocks.push("five_courses");

  if (unlocks.length) {
    j.milestones = [...j.milestones, ...unlocks];
    j.pendingCelebrations = [...j.pendingCelebrations, ...unlocks];
  }
}

function updateStreak(j: Journey, today: string) {
  if (j.lastCompletedDate === today) return;
  if (j.lastCompletedDate === addDays(today, -1)) {
    j.streak += 1;
  } else {
    j.streak = 1;
  }
  j.lastCompletedDate = today;
  if (j.streak > j.longestStreak) j.longestStreak = j.streak;
  j.xp += XP_DAILY_STREAK_BONUS * j.streak;
}

/** Record meaningful learning activity for today. */
export function logLearning(opts: { minutes?: number; courseId?: string; lessons?: number } = {}): Journey {
  const j = readJourney();
  const today = isoDate();
  const minutes = Math.max(0, Math.floor(opts.minutes ?? IMPLICIT_MINUTES));
  const day: DayActivity = j.days[today] ?? { minutes: 0, courses: [], lessons: 0 };
  day.minutes += minutes;
  day.lessons += opts.lessons ?? 1;
  if (opts.courseId && !day.courses.includes(opts.courseId)) day.courses.push(opts.courseId);
  j.days[today] = day;
  j.xp += XP_PER_CHECKIN + minutes * XP_PER_MINUTE;
  updateStreak(j, today);
  evaluateMilestones(j);
  writeJourney(j);
  return j;
}

export function getJourney(): Journey {
  return readJourney();
}

export function consumeCelebrations(): Milestone[] {
  const j = readJourney();
  if (!j.pendingCelebrations.length) return [];
  const list = j.pendingCelebrations;
  j.pendingCelebrations = [];
  writeJourney(j);
  return list;
}

/** Level curve: level = floor(sqrt(xp / 50)). */
export function levelInfo(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 50));
  const currentFloor = level * level * 50;
  const nextFloor = (level + 1) * (level + 1) * 50;
  const into = xp - currentFloor;
  const span = nextFloor - currentFloor;
  return { level, xp, into, span, nextFloor, pct: Math.min(100, Math.round((into / span) * 100)) };
}

export function todayStatus(): "completed" | "streak" | "pending" {
  const j = readJourney();
  const today = isoDate();
  if (j.lastCompletedDate === today) return j.streak >= 2 ? "streak" : "completed";
  return "pending";
}

export function last7Days(): { date: string; activity: DayActivity | null; isToday: boolean }[] {
  const j = readJourney();
  const today = isoDate();
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i - 6);
    return { date, activity: j.days[date] ?? null, isToday: date === today };
  });
}

export function heatmap(weeks = 18): { date: string; minutes: number }[] {
  const j = readJourney();
  const today = isoDate();
  const total = weeks * 7;
  return Array.from({ length: total }, (_, i) => {
    const date = addDays(today, i - (total - 1));
    return { date, minutes: j.days[date]?.minutes ?? 0 };
  });
}

export function journeyStats() {
  const j = readJourney();
  const days = Object.values(j.days);
  const totalMinutes = days.reduce((a, d) => a + d.minutes, 0);
  const totalLessons = days.reduce((a, d) => a + d.lessons, 0);
  const started = Object.values(j.courseProgress).filter((v) => v > 0).length;
  const completed = j.completedCourseIds.length;
  const completionPct = started === 0 ? 0 : Math.round((completed / started) * 100);
  return {
    currentStreak: j.streak,
    longestStreak: j.longestStreak,
    learningDays: Object.keys(j.days).length,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    totalMinutes,
    lessonsCompleted: totalLessons,
    coursesCompleted: completed,
    coursesStarted: started,
    completionPct,
    ...levelInfo(j.xp),
  };
}

export type StreakState = { streak: number; lastDate: string | null; bumped: boolean };

/** Backward-compatible: called on app load; no longer counts as a check-in. */
export function bumpStreak(): StreakState {
  const j = readJourney();
  return { streak: j.streak, lastDate: j.lastCompletedDate, bumped: false };
}

export function getStreak(): StreakState {
  return bumpStreak();
}

export function getCourseProgress(id: string): number {
  const j = readJourney();
  const c = j.courseProgress[id] ?? 0;
  return Math.min(100, Math.round((c / PROGRESS_STEPS) * 100));
}

export function bumpCourseProgress(id: string): number {
  const j = readJourney();
  const prev = j.courseProgress[id] ?? 0;
  const next = Math.min(PROGRESS_STEPS, prev + 1);
  j.courseProgress[id] = next;

  if (prev === 0) j.xp += XP_COURSE_START;
  if (next >= PROGRESS_STEPS && !j.completedCourseIds.includes(id)) {
    j.completedCourseIds.push(id);
    j.xp += XP_COURSE_COMPLETE;
  }

  // opening a course counts as a meaningful learning check-in for today
  const today = isoDate();
  const day: DayActivity = j.days[today] ?? { minutes: 0, courses: [], lessons: 0 };
  day.minutes += IMPLICIT_MINUTES;
  day.lessons += 1;
  if (!day.courses.includes(id)) day.courses.push(id);
  j.days[today] = day;
  j.xp += XP_PER_CHECKIN + IMPLICIT_MINUTES * XP_PER_MINUTE;
  updateStreak(j, today);
  evaluateMilestones(j);
  writeJourney(j);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lu:progress", { detail: { id } }));
  }
  return Math.min(100, Math.round((next / PROGRESS_STEPS) * 100));
}

export function getTotalCompleted(): number {
  return readJourney().completedCourseIds.length;
}

export function getTotalStarted(): number {
  return Object.values(readJourney().courseProgress).filter((v) => v > 0).length;
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