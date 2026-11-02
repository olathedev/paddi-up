import { getCircle } from "./current-circle";

export type Phase = "pre" | "event" | "post";

/** Today's date in Jos (WAT, UTC+1, no daylight saving) as YYYY-MM-DD. */
export function lagosToday(now = new Date()) {
  return new Date(now.getTime() + 3600_000).toISOString().slice(0, 10);
}

/** The circle's event day (YYYY-MM-DD), or null when it has no in-person event. */
export async function eventDay() {
  return (await getCircle())?.event_date ?? null;
}

/**
 * pre: before event day (Phase 1 only). event: event day (Phase 2 on). post: after, and for
 * circles with no event day (no venue features, no score cap).
 * QUEST_PHASE forces a phase, for testing venue features locally and for dry runs. Remove it afterwards.
 */
export async function phase(): Promise<Phase> {
  const forced = process.env.QUEST_PHASE;
  if (forced === "pre" || forced === "event" || forced === "post") return forced;
  const day = await eventDay();
  if (!day) return "post";
  const today = lagosToday();
  return today < day ? "pre" : today === day ? "event" : "post";
}

/** The date Phase 2 rows are stored under (check-ins). Forced event phase uses the real date. */
export async function eventDate() {
  if (process.env.QUEST_PHASE === "event") return lagosToday();
  return (await eventDay()) ?? lagosToday();
}

export async function daysUntilEvent() {
  const day = await eventDay();
  if (!day) return 0;
  const ms = Date.parse(`${day}T00:00:00Z`) - Date.parse(`${lagosToday()}T00:00:00Z`);
  return Math.max(0, Math.round(ms / 86400_000));
}

export function timeLabel(d: Date | string) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }).format(new Date(d));
}

/** One timestamp per render, so server and browser agree on "N min ago". */
export const serverNow = () => Date.now();
