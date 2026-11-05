"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Categories({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const getDistance = () => t.scrollWidth - window.innerWidth + 64;
        const tween = gsap.to(t, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".cat-card img").forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: wrap }
  );

  return (
    <section ref={wrap} className="relative overflow-hidden bg-paper py-20 lg:h-[100vh] lg:py-0">
      <div className="container-x lg:absolute lg:left-0 lg:top-14 lg:z-10">
        <SectionHeading eyebrow="Shop by room" title="Every room, made in one workshop" />
      </div>
      <div
        ref={track}
        className="mt-10 flex gap-5 overflow-x-auto px-[clamp(1rem,4vw,3.5rem)] pb-4 scrollbar-none snap-x snap-mandatory lg:mt-0 lg:h-full lg:items-end lg:overflow-visible lg:pb-14 lg:pt-56 lg:snap-none"
      >
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/products/${c.slug}`}
            className={`cat-card group relative shrink-0 snap-start overflow-hidden rounded-[1.6rem] bg-paper-2 ${
              i % 3 === 0 ? "h-[26rem] w-[20rem] lg:h-[30rem] lg:w-[26rem]" : "h-[26rem] w-[18rem] lg:h-[26rem] lg:w-[21rem]"
            }`}
          >
            {c.image ? (
              <Image src={c.image} alt={c.name} fill sizes="(max-width:1024px) 70vw, 30vw" className="object-cover scale-[1.18] transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.25]" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="eyebrow text-white/60">{counts[c.id] ?? 0} designs</p>
              <h3 className="font-display mt-2 text-[1.8rem] leading-tight tracking-[-0.02em]">{c.name}</h3>
              <p className="mt-1 text-sm text-white/70">{c.tagline}</p>
            </div>
            <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-500 group-hover:bg-white group-hover:text-ink">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        ))}
        <Link href="/products" className="group relative flex h-[26rem] w-[14rem] shrink-0 snap-start items-end rounded-[1.6rem] border border-line p-6 lg:w-[16rem]">
          <span className="font-display text-[1.6rem] leading-tight">All products <ArrowUpRight className="inline h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
        </Link>
      </div>
    </section>
  );
}
