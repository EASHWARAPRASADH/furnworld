import type { Metadata } from "next";
import { Suspense } from "react";
import { getContent } from "@/lib/content";
import { Builder } from "@/components/builder/Builder";

export const metadata: Metadata = { title: "3D furniture builder · design your own sofa, cot or dining table", description: "Choose seats, arms, legs, fabric and wood, spin it in 3D and send the exact specification to the Furn World workshop.", alternates: { canonical: "/builder" } };

export default async function BuilderPage() {
  const c = await getContent();
  return (
    <Suspense fallback={<div className="min-h-[calc(100svh-72px)] bg-ink" />}>
      <Builder config={c.builder} settings={c.settings} />
    </Suspense>
  );
}
