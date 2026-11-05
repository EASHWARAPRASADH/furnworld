import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="font-display display-soft mt-3 text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-[-0.03em]">That page has moved out.</h1>
        <p className="mt-4 text-muted">The piece you&apos;re looking for isn&apos;t here, but the collection is.</p>
        <Link href="/" className="btn btn-primary mt-8">Back to home</Link>
      </div>
    </div>
  );
}
