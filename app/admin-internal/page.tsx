import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginForm } from "@/components/admin/AdminForms";
import { AdminChrome, TopStrip, Wordmark } from "@/components/admin/Chrome";
import QRCode from "qrcode";
import {
  AddPartner,
  AddQuestion,
  CommunityImport,
  CreateCircle,
  EditPartner,
  PartnersSwitch,
  RemovePartner,
  ResetPartnerCode,
  RemoveQuestion,
  RoundButton,
} from "@/components/admin/QuestForms";
import { adminSiteUrl } from "@/lib/site";
import { cloudinaryEnabled } from "@/lib/cloudinary";
import { adminEnabled, adminPath, currentAdmin } from "@/lib/admin-auth";
import { listPartners, listReports, listRoundQuestions, listRounds, partnersOpen, questStats } from "@/lib/admin";
import { ROUND_TIME } from "@/lib/config";
import { eventDateLabel, getCircle } from "@/lib/current-circle";
import { CURRENT_CIRCLE } from "@/lib/roles";
import { supabaseAuthEnabled } from "@/lib/session";
import { phase } from "@/lib/time";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · PadiUp", robots: { index: false, follow: false } };

const when = new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos" });

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-zinc-100 pt-10">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-zinc-500">{sub}</p>
      {children}
    </section>
  );
}

export default async function QuestAdminPage() {
  if (!adminEnabled()) notFound();
  const base = `/${adminPath()}`;
  const me = await currentAdmin();
  if (!me) {
    return (
      <div className="flex min-h-svh flex-col bg-white font-sans text-ink">
        <TopStrip />
        <main className="grid flex-1 place-items-center px-4">
          <div className="w-full max-w-[22rem]">
            <div className="mb-8 flex justify-center">
              <Wordmark />
            </div>
            <h1 className="text-center text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 mb-8 text-center text-sm text-zinc-500">Sign in with your organiser email and PIN.</p>
            <LoginForm />
          </div>
        </main>
      </div>
    );
  }
  const [stats, reports, rounds, partnerRows, site, questions, partnersLive] = await Promise.all([
    questStats(),
    listReports(),
    listRounds(),
    listPartners(),
    adminSiteUrl(),
    listRoundQuestions(),
    partnersOpen(),
  ]);
  const partners = await Promise.all(
    partnerRows.map(async (p) => {
      const url = `${site}/s/${p.code}`;
      return { ...p, url, qr: await QRCode.toDataURL(url, { margin: 1, width: 1000, errorCorrectionLevel: "M" }) };
    }),
  );

  const env = process.env;
  const setup = [
    { label: "Session secret", ok: (env.QUEST_SESSION_SECRET ?? "").length >= 32, note: "QUEST_SESSION_SECRET" },
    { label: "Google sign-in (Supabase Auth)", ok: supabaseAuthEnabled(), note: "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" },
    { label: "X post checks", ok: Boolean(env.X_BEARER_TOKEN), note: "X_BEARER_TOKEN" },
    { label: "Scheduled jobs", ok: (env.CRON_SECRET ?? "").length >= 16, note: "CRON_SECRET" },
    { label: "Hall screen", ok: Boolean(env.QUEST_HALL_KEY), note: "QUEST_HALL_KEY" },
    { label: "Image uploads (Cloudinary)", ok: cloudinaryEnabled(), note: "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET" },
  ];
  const figures = [
    { label: "Players", value: stats.players, sub: `${stats.listed} listed in Who's coming` },
    { label: "Community claims", value: stats.claims, sub: `unverified · ${stats.matched} matched` },
    { label: "X posts", value: stats.xCounted, sub: `counted · ${stats.xPending} waiting for a check` },
    { label: "Open reports", value: stats.openReports, sub: `${stats.checkedIn} check-ins so far` },
  ];

  const circle = await getCircle();

  return (
    <AdminChrome user={me}>
      <h1 className="text-2xl font-semibold tracking-tight">PadiUp</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Phase: <span className="font-medium text-ink">{{ pre: "Before the event", event: "Event day", post: "After the event" }[await phase()]}</span>
        {env.QUEST_PHASE && <span className="text-yellow-700"> (forced by QUEST_PHASE)</span>}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {figures.map((f) => (
          <div key={f.label} className="rounded-2xl px-3 py-4 sm:px-5">
            <dt className="text-sm text-zinc-500">{f.label}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{f.value}</dd>
            <dd className="mt-1 text-xs text-zinc-400">{f.sub}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 space-y-14">
        <Section
          title="Circle"
          sub="The circle this deployment runs (PADIUP_CIRCLE). Every player is in it. Its event day sets the phase, and its socials, community link and hashtags are the Stage 1 follows and Home missions."
        >
          {circle ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 px-4 py-3 text-sm">
              <div className="flex flex-col">
                <span className="font-medium">
                  {circle.name} <span className="font-normal text-zinc-400">· run by {circle.host_name}</span>
                </span>
                <span className="text-zinc-500">
                  {circle.event_date ? `Event day ${eventDateLabel(circle.event_date)}` : "No event day set"}
                  {circle.venue && ` · ${circle.venue}`}
                </span>
              </div>
              <a href={`/c/${circle.slug}/admin?tab=settings`} className="font-medium text-g-blue hover:underline">
                Edit event, socials and missions
              </a>
            </div>
          ) : (
            <CreateCircle slug={CURRENT_CIRCLE} />
          )}
        </Section>

        <Section
          title="Brain Blitz rounds"
          sub={`Stage 3. Open a round when you announce it; players get ${ROUND_TIME} from the moment they tap Start, one attempt each. Close it when you're done: no new starts, and anyone mid-round has up to ${ROUND_TIME} to finish before the leaderboard is final.`}
        >
          <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80">
            {rounds.map((r) => {
              const live = Boolean(r.opened_at) && !r.closed_at;
              return (
                <li key={r.round} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="flex items-center gap-3">
                    <span aria-hidden className={`size-2 rounded-full ${live ? "bg-emerald-500" : r.closed_at ? "bg-zinc-400" : "bg-zinc-200"}`} />
                    <span className="font-medium">Round {r.round}</span>
                    <span className="text-zinc-500">
                      {live ? "Live" : r.closed_at ? `Closed ${when.format(new Date(r.closed_at))}` : "Not opened"} · {r.plays} played ·{" "}
                      {r.questions} questions
                    </span>
                  </span>
                  <span className="flex gap-2">
                    {!live && <RoundButton round={r.round} op="open" label={r.closed_at ? "Reopen" : "Open round"} />}
                    {live && <RoundButton round={r.round} op="close" label="Close round" />}
                  </span>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section
          title="Brain Blitz questions"
          sub="Add questions from the talks before you open a round. Each player gets 10 questions from the round, picked at random if it has more than 10. Remove only takes a question out of its round; answers and points already given stay."
        >
          <AddQuestion />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((r) => (
              <div key={r} className="rounded-2xl border border-zinc-200/80 p-4">
                <p className="mb-3 text-sm font-medium">
                  Round {r} <span className="text-zinc-400">· {questions[r].length} questions</span>
                </p>
                <ol className="space-y-2.5">
                  {questions[r].map((q) => (
                    <li key={q.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="min-w-0">
                        <span className="block">{q.question}</span>
                        <span className="block text-xs text-emerald-700">{q.options[q.correct]}</span>
                        {q.answers > 0 && <span className="block text-xs text-zinc-400">{q.answers} answers</span>}
                      </span>
                      <RemoveQuestion id={q.id} />
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Partners"
          sub="Stage 4. Add each partner, fill in their profile (Edit profile), then print their booth QR and give it to the people at their stand. Players earn points for reading a partner's profile and following them any time; booth scans wait until you open the stage here, and then each player still needs 3 padis. Remove only works before anyone has scanned."
        >
          <div className="mb-5">
            <PartnersSwitch open={partnersLive} />
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <AddPartner />
            {partners.length > 0 && (
              <a
                href={`${base}/print`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium hover:bg-zinc-50"
              >
                Print all partner QR codes
              </a>
            )}
          </div>
          {partners.length > 0 && (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((p) => (
                <li key={p.id} className="rounded-2xl border border-zinc-200/80 p-4">
                  <div className="flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL */}
                    <img src={p.qr} alt={`QR for ${p.name}`} className="size-24 shrink-0 rounded-lg border border-zinc-100" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                      <span className="truncate font-medium">
                        {p.name} {!p.active && <span className="text-xs font-normal text-zinc-400">(hidden)</span>}
                      </span>
                      <span className="text-zinc-500">{p.scans} scans</span>
                      <a href={p.qr} download={`partner-${p.name.replace(/\W+/g, "-").toLowerCase()}.png`} className="text-xs font-medium text-ink underline">
                        Download booth QR
                      </a>
                      <ResetPartnerCode id={p.id} name={p.name} />
                      {p.slug && <span className="truncate text-xs text-zinc-400">Profile: {site}/stage/partners/{p.slug}</span>}
                    </div>
                    <RemovePartner id={p.id} />
                  </div>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-medium text-ink">Edit profile</summary>
                    <EditPartner partner={p} canUpload={cloudinaryEnabled()} />
                  </details>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Connections" sub="What's configured on this server. Missing items are set as environment variables, then redeploy.">
          <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80">
            {setup.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="flex items-center gap-2.5">
                  <span aria-hidden className={`size-2 rounded-full ${s.ok ? "bg-emerald-500" : "bg-zinc-300"}`} />
                  {s.label}
                </span>
                <span className={`text-xs ${s.ok ? "text-emerald-700" : "text-zinc-400"}`}>{s.ok ? "Connected" : `Needs ${s.note}`}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Community members"
          sub="Players get their +15 as soon as they tap Join on the circle's community link (taken on trust). To check prize winners, export the community's member list and upload it here: claims whose sign-in email is on the list are marked matched. Upload it again any time; nobody is paid twice."
        >
          <CommunityImport />
        </Section>

        <Section title="Reports" sub="Reporting was retired: players can still block anyone, and blocked people stay hidden from each other. Reports filed before are kept here, read-only.">
          {reports.length === 0 ? (
            <p className="rounded-2xl border border-zinc-200/80 px-5 py-10 text-center text-sm text-zinc-500">No reports.</p>
          ) : (
            <ul className="space-y-2">
              {reports.map((r) => (
                <li key={`${r.blocker}:${r.blocked}`} className="rounded-2xl border border-zinc-200/80 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 text-sm">
                      <p>
                        <span className="font-medium">{r.reporterName}</span> <span className="text-zinc-400">({r.reporterEmail})</span> reported{" "}
                        <span className="font-medium">{r.reportedName}</span> <span className="text-zinc-400">({r.reportedEmail})</span>
                      </p>
                      <p className="mt-1 text-zinc-600">{r.reason ?? <span className="text-zinc-400">No reason given</span>}</p>
                      <p className="mt-1 text-xs text-zinc-400">{when.format(new Date(r.created_at))}</p>
                    </div>
                    <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">{r.status === "open" ? "Not reviewed" : "Reviewed"}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </AdminChrome>
  );
}
