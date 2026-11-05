import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Craft } from "@/components/home/Craft";
import { Testimonials } from "@/components/home/Testimonials";

export const metadata: Metadata = { title: "Our story · furniture makers since 1999", description: "Furn World started as a workshop in Karaikal in 1999. Today we design, manufacture and export furniture from showrooms in Chennai and Karaikal.", alternates: { canonical: "/about" } };

export default async function AboutPage() {
  const c = await getContent();
  const a = c.about;
  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} text={a.intro} image={a.heroImage} />
      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem]">
              {a.heroImage ? <Image src={a.heroImage} alt="" fill sizes="(max-width:1024px) 92vw, 40vw" className="object-cover" /> : null}
            </div>
          </div>
          <div className="lg:col-span-7 lg:pl-8">
            <div className="space-y-6 text-[1.1rem] leading-relaxed text-ink/85">
              {a.story.map((p, i) => <Reveal key={i} delay={i * 0.08}><p className={i === 0 ? "font-display text-[1.6rem] leading-snug text-ink" : ""}>{p}</p></Reveal>)}
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {a.values.map((v, i) => (
                <Reveal key={v.id} delay={i * 0.06}>
                  <div className="rounded-[1.3rem] bg-white p-6 ring-1 ring-line/60 h-full">
                    <h3 className="font-display text-[1.3rem]">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Craft about={a} />
      {a.galleryImages.length ? (
        <section className="container-x pb-20">
          <SectionHeading eyebrow="Showrooms & workshop" title="A look inside" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {a.galleryImages.map((g, i) => (
              <Reveal key={g + i} delay={i * 0.06}>
                <div className={`img-zoom relative overflow-hidden rounded-[1.2rem] ${i % 4 === 0 || i % 4 === 3 ? "aspect-[3/4]" : "aspect-square"}`}>
                  <Image src={g} alt="" fill sizes="(max-width:768px) 45vw, 23vw" className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
      <Testimonials items={c.testimonials} />
    </>
  );
}
