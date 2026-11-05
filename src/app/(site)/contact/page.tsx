import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = { title: "Showrooms in Chennai & Karaikal · contact", description: "Visit Furn World at Kodambakkam, Chennai or Bharathiar Road, Karaikal. Call, WhatsApp or send a message for a quote.", alternates: { canonical: "/contact" } };

export default async function ContactPage() {
  const c = await getContent();
  return (
    <>
      <PageHero eyebrow="Showrooms & contact" title="Come and sit on it" text="Walk into either showroom, call us, or send a message. We reply within one working day." />
      <section className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            {c.branches.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.1}>
                <div className="grid gap-6 rounded-[1.6rem] bg-white p-6 ring-1 ring-line/60 md:grid-cols-2">
                  <div>
                    <h2 className="font-display text-[1.7rem] tracking-[-0.01em]">{b.name}</h2>
                    <ul className="mt-5 space-y-3 text-sm">
                      <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{b.address}</span></li>
                      {b.phones.map((p) => <li key={p} className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-accent">{p}</a></li>)}
                      {b.email ? <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href={`mailto:${b.email}`} className="hover:text-accent">{b.email}</a></li> : null}
                      {b.hours ? <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{b.hours}</span></li> : null}
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-[1.1rem] bg-paper-2 min-h-[220px]">
                    <iframe
                      title={`Map of ${b.name}`}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(b.mapQuery || b.address)}&output=embed`}
                      className="h-full w-full min-h-[220px] border-0 grayscale-[30%]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="rounded-[1.6rem] bg-white p-6 ring-1 ring-line/60 md:p-8 lg:sticky lg:top-24">
                <h2 className="font-display text-[1.7rem] tracking-[-0.01em]">Send us a message</h2>
                <p className="mt-2 text-sm text-muted">Tell us what you&apos;re looking for and we&apos;ll call you back.</p>
                <div className="mt-6">
                  <EnquiryForm whatsapp={c.settings.whatsapp} siteName={c.settings.siteName} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
