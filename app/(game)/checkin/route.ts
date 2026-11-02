import { NextResponse } from "next/server";
import { getMe } from "@/lib/auth";
import { entranceCodeValid } from "@/lib/entrance";
import { checkIn } from "@/lib/game";
import { CHECKIN_COOKIE, cookieOptions, seal } from "@/lib/session";
import { phase } from "@/lib/time";
import { siteUrl } from "@/lib/site";

/** The rotating entrance QR opens this link. The code is checked the moment it's opened. */
export async function GET(req: Request) {
  const base = siteUrl(req);
  if ((await phase()) !== "event") return NextResponse.redirect(`${base}/event?r=early`);
  const code = new URL(req.url).searchParams.get("c") ?? "";
  if (!entranceCodeValid(code)) return NextResponse.redirect(`${base}/event?r=expired`);

  const me = await getMe();
  if (!me) {
    // Not signed in yet: hold the valid scan for 10 minutes while they sign in.
    const res = NextResponse.redirect(`${base}/`);
    res.cookies.set(CHECKIN_COOKIE, seal({ ok: true }, 600), cookieOptions(600));
    return res;
  }
  await checkIn(me.id);
  return NextResponse.redirect(`${base}/event?r=checkedin`);
}
