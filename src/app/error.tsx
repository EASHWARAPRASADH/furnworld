"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6 text-center">
      <div>
        <p className="eyebrow">Something slipped</p>
        <h1 className="font-display display-soft mt-3 text-[clamp(2.2rem,5vw,4rem)] leading-none tracking-[-0.03em]">That didn&apos;t go to plan.</h1>
        <p className="mt-4 text-muted">Please try again, or head back to the collection.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={reset} className="btn btn-primary">Try again</button>
          <Link href="/" className="btn btn-ghost">Home</Link>
        </div>
      </div>
    </div>
  );
}
