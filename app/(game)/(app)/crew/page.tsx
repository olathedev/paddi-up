import CrewList from "@/components/CrewList";
import { requireAgent } from "@/lib/auth";
import { currentRoles, withRoles } from "@/lib/circles";
import { crew } from "@/lib/game";
import { serverNow } from "@/lib/time";

export const metadata = { title: "Padis" };

export default async function Crew() {
  const me = await requireAgent();
  const c = await crew(me.id);
  const { circle, roles } = await currentRoles([...c.pending, ...c.connected].map((p) => p.id));
  const pending = withRoles(c.pending, roles);
  const connected = withRoles(c.connected, roles);
  return (
    <div className="flex flex-col gap-5 pt-2">
      <header className="flex flex-col gap-1">
        <h1 className="type-heading text-[26px] leading-tight font-bold">Padis</h1>
        <p className="text-sm text-fg/60">People you&apos;ve connected with. Their socials show here once you&apos;re padis.</p>
      </header>
      <CrewList pending={pending} connected={connected} now={serverNow()} circleName={circle?.name} />
    </div>
  );
}
