import type { ReactNode } from "react";
import type { AdminUser } from "@/lib/admin-auth";
import UserMenu from "./UserMenu";

/** A slim slice of the shapes strip along the very top edge. */
export function TopStrip() {
  return <div aria-hidden className="h-3 w-full bg-[#0a2914] bg-[url(/divider.svg)] bg-[length:auto_82px] bg-[position:center_-34px] bg-repeat-x sm:h-4" />;
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 leading-none">
      <span className="text-[17px] font-bold tracking-tight">PadiUp</span>
      <span className="text-sm font-medium text-zinc-400">Admin</span>
    </span>
  );
}

/** Page frame for signed-in admin pages: top strip, header, centred content. */
export function AdminChrome({ user, children }: { user: AdminUser; children: ReactNode }) {
  return (
    <div className="min-h-svh bg-white font-sans text-ink">
      <TopStrip />
      <header className="border-b border-zinc-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Wordmark />
          <UserMenu email={user.email} role={user.role} />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 pt-10 pb-20 sm:px-8">{children}</main>
    </div>
  );
}
