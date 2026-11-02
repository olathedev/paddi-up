import { NextResponse } from "next/server";
import { getMe } from "@/lib/auth";
import { GameError, scanStation } from "@/lib/game";
import { siteUrl } from "@/lib/site";

/** Printed room-door and booth QRs open this link in the phone camera. Booth scans land on the partner's profile. */
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const base = siteUrl(req);
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(code)) return NextResponse.redirect(`${base}/event?r=unknown`);

  const me = await getMe();
  if (!me?.onboarded_at) return NextResponse.redirect(`${base}/?next=${encodeURIComponent(`/s/${code}`)}`);

  try {
    const res = await scanStation(me.id, code);
    const r = res.fresh ? res.kind : "again";
    if (res.kind === "booth" && res.slug) return NextResponse.redirect(`${base}/stage/partners/${res.slug}?r=${r}`);
    const page = res.kind === "booth" ? "stage/partners" : "event";
    return NextResponse.redirect(`${base}/${page}?r=${r}${res.kind === "booth" ? `&n=${encodeURIComponent(res.name)}` : ""}`);
  } catch (e) {
    if (e instanceof GameError) {
      const page = e.code === "locked" || e.code === "inactive" ? "stage/partners" : "event";
      return NextResponse.redirect(`${base}/${page}?r=${e.code ?? "unknown"}`);
    }
    throw e;
  }
}
