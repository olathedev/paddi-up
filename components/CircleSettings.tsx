"use client";

import { useActionState } from "react";
import { type AdminResult, saveCircleSettingsAction } from "@/app/(game)/c/actions";
import { POINTS } from "@/lib/config";
import { gameBtn } from "./ui";

const field =
  "h-12 w-full rounded-2xl border border-fg/[0.12] bg-surface px-4 text-base text-fg outline-none placeholder:text-fg/30 focus:border-h-yellow";
const label = "text-[11px] font-bold tracking-[0.2em] text-fg/50";
const hint = "text-xs text-fg/50";

type Values = {
  whatsapp_url: string | null;
  x: string | null;
  instagram: string | null;
  linkedin: string | null;
  facebook: string | null;
  youtube: string | null;
  website_url: string | null;
  event_date: string | null;
  venue: string | null;
  city: string | null;
  community_url: string | null;
  hashtags: string | null;
};

/** Everything event-specific about the circle: its event day, Stage 1 follows and the missions on Home. */
export default function CircleSettings({ slug, host, values }: { slug: string; host: string; values: Values }) {
  const [state, action, pending] = useActionState<AdminResult, FormData>(saveCircleSettingsAction.bind(null, slug), null);
  const handles = [
    { id: "x", name: "X" },
    { id: "instagram", name: "Instagram" },
    { id: "linkedin", name: "LinkedIn page" },
    { id: "facebook", name: "Facebook" },
    { id: "youtube", name: "YouTube" },
  ] as const;
  return (
    <form action={action} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className={`${label} mb-2`}>EVENT</legend>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-fg/60">Event day</span>
          <input name="event_date" type="date" defaultValue={values.event_date ?? ""} className={field} />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-fg/60">Venue</span>
            <input name="venue" maxLength={80} defaultValue={values.venue ?? ""} autoComplete="off" className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-fg/60">City</span>
            <input name="city" maxLength={40} defaultValue={values.city ?? ""} autoComplete="off" className={field} />
          </label>
        </div>
        <span className={hint}>Check-in and venue scans open on event day. Before it, scores stop at the pre-event cap. Leave the date empty if there&apos;s no in-person day.</span>
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <legend className={`${label} mb-2`}>
          FOLLOW {host.toUpperCase()} (STAGE 1, +{POINTS.follow} EACH)
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {handles.map((h) => (
            <label key={h.id} className="flex flex-col gap-1">
              <span className="text-xs font-bold text-fg/60">{h.name}</span>
              <input name={h.id} defaultValue={values[h.id] ?? ""} placeholder="handle" autoComplete="off" className={field} />
            </label>
          ))}
        </div>
        <span className={hint}>Players follow every platform filled in here to clear Stage 1.</span>
      </fieldset>
      <label className="flex flex-col gap-2">
        <span className={label}>COMMUNITY LINK (+{POINTS.community})</span>
        <input name="community_url" type="url" defaultValue={values.community_url ?? ""} placeholder="https://…" className={field} />
        <span className={hint}>Where players join {host} all year round. Empty hides the mission.</span>
      </label>
      <label className="flex flex-col gap-2">
        <span className={label}>X POST HASHTAGS (+{POINTS.xPost})</span>
        <input name="hashtags" defaultValue={values.hashtags ?? ""} placeholder="#MyEvent #MyEvent2026" autoComplete="off" className={field} />
        <span className={hint}>Up to 3. Posts must use them and mention the X handle above. Empty hides the mission.</span>
      </label>
      <label className="flex flex-col gap-2">
        <span className={label}>WHATSAPP GROUP LINK</span>
        <input name="whatsapp_url" type="url" defaultValue={values.whatsapp_url ?? ""} placeholder="https://chat.whatsapp.com/…" className={field} />
        <span className={hint}>Empty hides the WhatsApp button.</span>
      </label>
      <label className="flex flex-col gap-2">
        <span className={label}>WEBSITE</span>
        <input name="website_url" type="url" defaultValue={values.website_url ?? ""} placeholder="https://…" className={field} />
      </label>
      <button type="submit" disabled={pending} className={gameBtn}>
        {pending ? "Saving…" : "Save"}
      </button>
      {state && (
        <p role="status" className={`rounded-full border px-4 py-2.5 text-center text-sm font-bold ${state.ok ? "border-g-green/40 bg-g-green/10 text-good" : "border-g-red/40 bg-g-red/10 text-bad"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
