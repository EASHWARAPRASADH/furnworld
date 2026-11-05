"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Banner } from "@/lib/types";

function BannerCard({ banner, tall }: { banner: Banner; tall: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <Link ref={ref} href={banner.href || "/products"} className={`group relative block overflow-hidden rounded-[1.8rem] ${tall ? "aspect-[4/5] lg:aspect-[3/4]" : "aspect-[4/5] lg:aspect-[4/3]"}`}>
      <motion.div style={{ y }} className="absolute inset-[-14%_0]">
        {banner.image ? <Image src={banner.image} alt={banner.title} fill sizes="(max-width:1024px) 92vw, 46vw" className="object-cover" /> : null}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7 text-white">
        <div>
          <p className="eyebrow text-white/60">{banner.eyebrow}</p>
          <h3 className="font-display display-soft mt-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.02em]">{banner.title}</h3>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
      </div>
    </Link>
  );
}

export function Banners({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;
  return (
    <section className="container-x py-10">
      <div className="grid gap-5 lg:grid-cols-2">
        {banners.slice(0, 2).map((b, i) => <BannerCard key={b.id} banner={b} tall={i === 0} />)}
      </div>
    </section>
  );
}
