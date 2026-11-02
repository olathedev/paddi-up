"use client";

import { Loading03Icon, LockIcon } from "@hugeicons/core-free-icons";
import Icon from "./Icon";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/admin-internal/actions";

const field =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-base outline-none sm:text-[15px] placeholder:text-zinc-400 hover:border-zinc-300 focus:border-ink/30 focus:ring-4 focus:ring-zinc-100";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, null);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" className={field} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700">
          PIN
        </label>
        <input id="password" name="password" type="password" required minLength={6} maxLength={200} inputMode="numeric" autoComplete="current-password" className={field} />
      </div>
      {state && !state.ok && (
        <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-600/15 ring-inset">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-white hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-g-blue disabled:opacity-70"
      >
        <Icon icon={pending ? Loading03Icon : LockIcon} className={`size-4 ${pending ? "animate-spin" : ""}`} />
        Sign in
      </button>
    </form>
  );
}

