import Link from "next/link";
import { QrGlyph } from "@/components/icons";
import Scanner from "@/components/Scanner";
import { gameBtnGhost } from "@/components/ui";
import { requireAgent } from "@/lib/auth";

export const metadata = { title: "Scan" };

export default async function ScanPage() {
  await requireAgent();
  return (
    <div className="flex flex-col items-center gap-5 pt-2 text-center">
      <header className="flex flex-col items-center gap-1.5">
        <span className="text-[11px] font-bold tracking-[0.2em] text-fg/45">SCAN</span>
        <h1 className="type-heading text-[26px] leading-tight font-bold">Point at a code</h1>
        <p className="max-w-xs text-sm text-fg/60">A player&apos;s Quest QR to lock them in, or a partner&apos;s code at their stand.</p>
      </header>
      <Scanner />
      <Link href="/me" className={gameBtnGhost}>
        <QrGlyph size={18} /> Show my QR instead
      </Link>
    </div>
  );
}
