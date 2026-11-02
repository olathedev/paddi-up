import SocialsStage from "@/components/SocialsStage";
import { StageHeader } from "@/components/Stage";
import { requireAgent } from "@/lib/auth";
import { circleFollows, getCircle } from "@/lib/circles";
import { missions } from "@/lib/game";

export const metadata = { title: "Follow the Signal" };

export default async function SocialsPage() {
  const me = await requireAgent();
  const [m, circle] = await Promise.all([missions(me.id), getCircle()]);
  const follows = circleFollows(circle);
  return (
    <div className="flex flex-col gap-6">
      <StageHeader id="socials" progress={m.followed.length} goal={follows.length} done={m.followed.length >= follows.length} />
      <SocialsStage follows={follows} followed={m.followed} host={circle?.host_name ?? "your circle"} />
    </div>
  );
}
