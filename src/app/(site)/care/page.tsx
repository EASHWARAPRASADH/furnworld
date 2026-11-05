import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export const metadata: Metadata = { title: "Care & warranty", description: "How to look after solid wood, upholstery, leather and laminates, and what the Furn World workshop warranty covers.", alternates: { canonical: "/care" } };

export default async function CarePage() {
  const c = await getContent();
  const img = c.about.galleryImages[1] ?? c.about.heroImage;
  return (
    <>
      <PageHero eyebrow="Looking after it" title={c.care.title} text={c.care.intro} />
      <section className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {img ? <ParallaxImage src={img} className="aspect-[4/5] rounded-[1.8rem] lg:sticky lg:top-24" sizes="(max-width:1024px) 92vw, 40vw" /> : null}
          </div>
          <ol className="space-y-10 lg:col-span-7 lg:pl-6">
            {c.care.sections.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05} as="li">
                <div className="grid gap-4 border-t border-line pt-8 md:grid-cols-[4rem_1fr]">
                  <span className="font-display text-[1.4rem] text-accent">0{i + 1}</span>
                  <div>
                    <h2 className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight tracking-[-0.01em]">{s.title}</h2>
                    <p className="mt-3 text-[1.02rem] leading-relaxed text-muted">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
