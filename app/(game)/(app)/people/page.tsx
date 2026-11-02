import PeopleList from "@/components/PeopleList";
import { requireAgent } from "@/lib/auth";
import { currentRoles, withRoles } from "@/lib/circles";
import { directory } from "@/lib/game";
import { serverNow } from "@/lib/time";

export const metadata = { title: "People" };

export default async function People({ searchParams }: PageProps<"/people">) {
  const me = await requireAgent();
  const list = await directory(me.id);
  const { circle, roles } = await currentRoles(list.map((p) => p.id));
  const people = withRoles(list, roles);
  const now = serverNow();
  const r = (await searchParams).role;
  const initialRole = r === "organisers" || r === "speakers" ? r : null;

  return (
    <div className="flex flex-col gap-5 pt-2">
      <header className="flex flex-col gap-1">
        <h1 className="type-heading text-[26px] leading-tight font-bold">
          People <span className="text-fg/35">· {people.length}</span>
        </h1>
        <p className="text-sm text-fg/60">Everyone playing in {circle?.name ?? "your circle"}. Send a padi request to swap socials.</p>
      </header>
      <PeopleList people={people} canConnect now={now} circleName={circle?.name ?? "PadiUp"} initialRole={initialRole} />
    </div>
  );
}
