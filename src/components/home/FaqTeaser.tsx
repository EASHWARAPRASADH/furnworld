import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Faq } from "@/lib/types";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function FaqTeaser({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="container-x py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="Good to know" title="Questions people ask us" />
          <Reveal delay={0.2}><Link href="/faq" className="btn btn-ghost mt-8">All questions <ArrowUpRight className="arrow h-4 w-4" /></Link></Reveal>
        </div>
        <div className="lg:col-span-8">
          <Reveal><Accordion items={faqs.map((f) => ({ id: f.id, title: f.question, body: f.answer }))} /></Reveal>
        </div>
      </div>
    </section>
  );
}
