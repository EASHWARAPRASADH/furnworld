import type { ReactNode } from "react";

export function Marquee({ children, className = "", speed = 40, reverse = false }: { children: ReactNode; className?: string; speed?: number; reverse?: boolean }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div
        className="inline-flex w-max animate-marquee"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex items-center">{children}</div>
        <div className="flex items-center">{children}</div>
      </div>
    </div>
  );
}
