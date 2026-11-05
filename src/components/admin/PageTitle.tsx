import type { ReactNode } from "react";

export function PageTitle({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[2rem] tracking-[-0.02em]">{title}</h1>
        {text ? <p className="mt-1 text-sm text-muted">{text}</p> : null}
      </div>
      {action}
    </div>
  );
}
