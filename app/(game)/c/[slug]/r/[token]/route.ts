import { NextResponse } from "next/server";
import { getMe } from "@/lib/auth";
import { getCircle } from "@/lib/circles";
import { redeemRoleInvite } from "@/lib/invites";
import { siteUrl } from "@/lib/site";

/**
 * A role invite link. Signed out: sign in and come back here. Then the link's role is applied
 * if it's higher than what they have, and they land on their profile. Link previews (signed out)
 * only ever get a redirect, so they never use a link up.
 */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string; token: string }> }) {
  const { slug, token } = await params;
  const base = siteUrl(req);
  const circle = await getCircle(slug);
  if (!circle) return NextResponse.redirect(`${base}/`);
  const here = `/c/${circle.slug}/r/${encodeURIComponent(token)}`;

  const me = await getMe();
  if (!me) return NextResponse.redirect(`${base}/?next=${encodeURIComponent(here)}`);
  if (!me.onboarded_at || !me.avatar) return NextResponse.redirect(`${base}/setup?next=${encodeURIComponent(here)}`);

  const res = await redeemRoleInvite(circle, me, token);
  if (res.status === "inactive" || res.status === "slow") return NextResponse.redirect(`${base}/c/${circle.slug}?invite=${res.status}`);
  return NextResponse.redirect(`${base}/profile?role=${res.status === "granted" ? res.role : "kept"}`);
}
