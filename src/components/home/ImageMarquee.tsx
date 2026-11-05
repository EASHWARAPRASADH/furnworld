import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/ui/Marquee";

export function ImageMarquee({ items }: { items: { src: string; alt: string; href: string }[] }) {
  if (items.length === 0) return null;
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)];
  return (
    <section className="space-y-4 py-6" aria-label="Recent pieces">
      {rows.map((row, r) => (
        <Marquee key={r} speed={70 + r * 20} reverse={r === 1}>
          {row.map((it, i) => (
            <Link key={it.href + i} href={it.href} data-cursor="View" className="img-zoom relative mx-2 block h-40 w-56 overflow-hidden rounded-[1.1rem] bg-paper-2 md:h-52 md:w-72">
              <Image src={it.src} alt={it.alt} fill sizes="300px" className="object-cover" />
            </Link>
          ))}
        </Marquee>
      ))}
    </section>
  );
}
