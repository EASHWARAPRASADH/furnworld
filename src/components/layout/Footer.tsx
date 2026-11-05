import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Branch, Category, Settings } from "@/lib/types";
import { waLink } from "@/lib/format";
import { Year } from "@/components/ui/Year";
import { FooterWordmark } from "./FooterWordmark";
import { Magnetic } from "@/components/ui/Magnetic";

export function Footer({ settings, categories, branches }: { settings: Settings; categories: Category[]; branches: Branch[] }) {
  const socials = [
    { href: settings.instagram, label: "Instagram" },
    { href: settings.facebook, label: "Facebook" },
    { href: settings.youtube, label: "YouTube" },
  ].filter((s) => s.href);
  return (
    <footer className="relative mt-24 bg-ink text-white overflow-hidden">
      <div className="container-x pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-white/50">Ready when you are</p>
            <h2 className="font-display display-soft mt-4 text-[clamp(2.4rem,5vw,4.6rem)] leading-[1] tracking-[-0.02em]">
              Let&apos;s build something that lasts.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <a href={waLink(settings.whatsapp, `Hi ${settings.siteName}, I'd like a quote.`)} target="_blank" rel="noreferrer" className="btn btn-light">
                  WhatsApp us <ArrowUpRight className="arrow h-4 w-4" />
                </a>
              </Magnetic>
              <Magnetic>
                <Link href="/builder" className="btn btn-outline-light">Open the 3D builder</Link>
              </Magnetic>
            </div>
            {socials.length ? (
              <div className="mt-8 flex gap-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white hover:text-white">{s.label} <ArrowUpRight className="h-3.5 w-3.5" /></a>
                ))}
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:pl-10">
            <div>
              <p className="eyebrow text-white/50 mb-4">Collection</p>
              <ul className="space-y-2.5 text-[0.95rem]">
                {categories.map((c) => (
                  <li key={c.id}><Link href={`/products/${c.slug}`} className="link-underline text-white/80 hover:text-white transition-colors">{c.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-white/50 mb-4">Company</p>
              <ul className="space-y-2.5 text-[0.95rem]">
                <li><Link href="/about" className="link-underline text-white/80 hover:text-white">Our story</Link></li>
                <li><Link href="/builder" className="link-underline text-white/80 hover:text-white">3D builder</Link></li>
                <li><Link href="/contact" className="link-underline text-white/80 hover:text-white">Showrooms</Link></li>
                <li><Link href="/faq" className="link-underline text-white/80 hover:text-white">Questions</Link></li>
                <li><Link href="/care" className="link-underline text-white/80 hover:text-white">Care & warranty</Link></li>
                <li><Link href="/products" className="link-underline text-white/80 hover:text-white">All products</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow text-white/50 mb-4">Visit us</p>
              <ul className="space-y-5 text-[0.9rem] text-white/75">
                {branches.map((b) => (
                  <li key={b.id}>
                    <p className="font-semibold text-white">{b.name}</p>
                    <p className="mt-1 leading-relaxed">{b.address}</p>
                    <p className="mt-1">{b.phones.join(" · ")}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-6 text-[0.8rem] text-white/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© <Year /> {settings.siteName}. {settings.footerNote}</p>
          <p>{settings.primaryEmail} · {settings.primaryPhone}</p>
        </div>
      </div>
      <FooterWordmark text={settings.siteName} />
    </footer>
  );
}
