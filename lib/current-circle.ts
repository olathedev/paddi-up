import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { CURRENT_CIRCLE } from "./roles";
import { PARTNER_HANDLE } from "./validate";

// The circle a deployment runs (PADIUP_CIRCLE) and its event: socials to follow, community and
// WhatsApp links, X hashtags and the event day. Everything event-specific lives on the circle row,
// so nothing here names a particular event. Kept apart from circles.ts so game, points and time
// can read it without import cycles.

export type Circle = {
  id: string;
  slug: string;
  name: string;
  host_name: string;
  whatsapp_url: string | null;
  x: string | null;
  instagram: string | null;
  linkedin: string | null;
  facebook: string | null;
  youtube: string | null;
  website_url: string | null;
  /** YYYY-MM-DD in Africa/Lagos, or null when the circle has no in-person event. */
  event_date: string | null;
  venue: string | null;
  city: string | null;
  community_url: string | null;
  /** Space-separated, e.g. "#MyEvent #MyEvent2026". */
  hashtags: string | null;
  /** X posts count from here (falls back to when the circle was created). */
  launch_at: Date;
};

const fetchCircle = cache(async (slug: string) => {
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) return null;
  const [c] = await db()<Circle[]>`
    select id, slug, name, host_name, whatsapp_url, x, instagram, linkedin, facebook, youtube, website_url,
           event_date::text as event_date, venue, city, community_url, hashtags,
           coalesce(launch_at, created_at) as launch_at
    from quest_circles where slug = ${slug}`;
  return c ?? null;
});

export const getCircle = (slug: string = CURRENT_CIRCLE) => fetchCircle(slug);

export const CIRCLE_SOCIALS = [
  { id: "x", name: "X", href: (h: string) => `https://x.com/${h}`, handle: (h: string) => `@${h}` },
  { id: "instagram", name: "Instagram", href: (h: string) => `https://www.instagram.com/${h}`, handle: (h: string) => `@${h}` },
  { id: "linkedin", name: "LinkedIn", href: (h: string) => `https://www.linkedin.com/company/${h}`, handle: (h: string) => h },
  { id: "facebook", name: "Facebook", href: (h: string) => `https://www.facebook.com/${h}`, handle: (h: string) => h },
  { id: "youtube", name: "YouTube", href: (h: string) => `https://www.youtube.com/@${h}`, handle: (h: string) => `@${h}` },
] as const;

export type Follow = { id: string; name: string; handle: string; href: string };

/** Stage 1: one follow per platform the circle has filled in. */
export function circleFollows(c: Circle | null): Follow[] {
  if (!c) return [];
  return CIRCLE_SOCIALS.flatMap((s) => {
    const h = c[s.id];
    return h && PARTNER_HANDLE.test(h) ? [{ id: s.id, name: s.name, handle: s.handle(h), href: s.href(h) }] : [];
  });
}

/** Links for the socials row on Home: the follows plus the website. */
export function circleSocialLinks(c: Circle) {
  const out: { id: string; name: string; href: string }[] = circleFollows(c).map(({ id, name, href }) => ({ id, name, href }));
  if (c.website_url) out.push({ id: "website", name: "website", href: c.website_url });
  return out;
}

/** The X mission runs only when the circle has hashtags and an X handle to mention. */
export function circleXPost(c: Circle | null) {
  if (!c?.hashtags || !c.x) return null;
  return { hashtags: c.hashtags.split(/\s+/).filter(Boolean), mention: `@${c.x}`, launchAt: c.launch_at };
}

/** "Sat, 17 Oct 2026" for an event date. */
export const eventDateLabel = (day: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));

/** "17 Oct" for an event date. */
export const eventDayShort = (day: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
