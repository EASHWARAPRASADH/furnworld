import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import type { Branch, Settings } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { waLink } from "@/lib/format";

export function Showrooms({ branches, settings }: { branches: Branch[]; settings: Settings }) {
  return (
    <section className="container-x py-24">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Visit a showroom" title="Sit on it before you decide" text="Two showrooms, one workshop. Walk in, try the pieces, and talk to the people who make them." />
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={waLink(settings.whatsapp, `Hi ${settings.siteName}, I'd like to visit a showroom.`)} target="_blank" rel="noreferrer" className="btn btn-primary">WhatsApp us <ArrowUpRight className="arrow h-4 w-4" /></a>
              <Link href="/contact" className="btn btn-ghost">Directions</Link>
            </div>
          </Reveal>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
          {branches.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.1}>
              <div className="card-hover h-full rounded-[1.4rem] bg-white p-7 ring-1 ring-line/60">
                <MapPin className="h-5 w-5 text-accent" />
                <h3 className="font-display mt-4 text-[1.5rem]">{b.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.address}</p>
                <p className="mt-3 text-sm text-muted">{b.hours}</p>
                <div className="mt-5 space-y-1.5">
                  {b.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm font-medium hover:text-accent"><Phone className="h-3.5 w-3.5" /> {p}</a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
