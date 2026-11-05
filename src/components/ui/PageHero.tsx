import Image from "next/image";
import { SplitWords, Reveal } from "./Reveal";

export function PageHero({ eyebrow, title, text, image, children }: { eyebrow?: string; title: string; text?: string; image?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {image ? (
        <div className="absolute inset-0">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.16]" />
          <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/70 to-paper" />
        </div>
      ) : null}
      <div className="container-x relative pt-16 pb-14 md:pt-24 md:pb-20">
        {eyebrow ? <Reveal><p className="eyebrow">{eyebrow}</p></Reveal> : null}
        <SplitWords as="h1" text={title} className="font-display display-soft mt-4 max-w-4xl text-[clamp(2.6rem,6.5vw,5.8rem)] leading-[0.98] tracking-[-0.03em]" />
        {text ? <Reveal delay={0.15}><p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted">{text}</p></Reveal> : null}
        {children}
      </div>
    </section>
  );
}
