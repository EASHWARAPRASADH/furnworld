"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4">
      <form action={action} className="w-full max-w-sm rounded-[1.6rem] bg-white p-8 shadow-2xl">
        <p className="eyebrow">Furn World</p>
        <h1 className="font-display mt-2 text-[2rem] tracking-[-0.02em]">Admin sign in</h1>
        <div className="mt-6 space-y-4">
          <label className="block"><span className="label">Username</span><input name="username" className="input" autoComplete="username" required /></label>
          <label className="block"><span className="label">Password</span><input name="password" type="password" className="input" autoComplete="current-password" required /></label>
        </div>
        {state?.error ? <p className="mt-4 text-sm text-accent">{state.error}</p> : null}
        <button disabled={pending} className="btn btn-primary mt-6 w-full justify-center disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Sign in</button>
      </form>
    </div>
  );
}
