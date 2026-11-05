"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Result = { ok: true; id?: string } | { ok: false; error: string };

export function useSave() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<Result>, opts?: { then?: (r: Result) => void; message?: string }) => {
    setMessage(null); setError(null);
    start(async () => {
      const r = await fn();
      if (r.ok) {
        setMessage(opts?.message ?? "Saved.");
        router.refresh();
        opts?.then?.(r);
        setTimeout(() => setMessage(null), 2500);
      } else setError(r.error);
    });
  };
  return { pending, message, error, run };
}
