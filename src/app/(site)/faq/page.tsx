import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { waLink } from "@/lib/format";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = { title: "Questions & answers", description: "Custom sizes, delivery across Tamil Nadu and India, wood types, timelines and warranty: answers from the Furn World workshop.", alternates: { canonical: "/faq" } };

export default async function FaqPage() {
  const c = await getContent();
  return (
    <>
      <JsonLd data={faqJsonLd(c.faqs)} />
      <PageHero eyebrow="Good to know" title="Questions people ask us" text="Sizes, timelines, delivery, wood and warranty. If your question isn't here, WhatsApp us and a person will answer." />
      <section className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal><Accordion items={c.faqs.map((f) => ({ id: f.id, title: f.question, body: f.answer }))} /></Reveal>
          </div>
          <div className="lg:col-span-4">
            <Reveal delay={0.15}>
              <div className="rounded-[1.6rem] bg-ink p-7 text-white lg:sticky lg:top-24">
                <p className="eyebrow text-white/50">Still wondering?</p>
                <h2 className="font-display display-soft mt-3 text-[1.9rem] leading-[1.05] tracking-[-0.02em]">Ask the people who make it.</h2>
                <div className="mt-6 flex flex-col gap-2">
                  <a href={waLink(c.settings.whatsapp, `Hi ${c.settings.siteName}, I have a question.`)} target="_blank" rel="noreferrer" className="btn btn-light justify-center">WhatsApp us <ArrowUpRight className="arrow h-4 w-4" /></a>
                  <Link href="/care" className="btn btn-outline-light justify-center">Care & warranty</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
