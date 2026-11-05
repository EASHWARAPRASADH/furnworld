"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import type { Category, Settings } from "@/lib/types";
import { waLink } from "@/lib/format";
import { Magnetic } from "@/components/ui/Magnetic";

const nav = [
  { href: "/products", label: "Collection" },
  { href: "/builder", label: "3D Builder" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Showrooms" },
];

export function Header({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const dark = pathname === "/" || pathname === "/builder";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  const onDark = dark && !scrolled && !open;
  const wa = waLink(settings.whatsapp, `Hi ${settings.siteName}, I'd like to know more about your furniture.`);

  return (
    <>
      {settings.announcement ? (
        <div className="relative z-50 bg-ink text-white text-[0.72rem] tracking-[0.08em] uppercase text-center py-2 px-4 font-medium">
          {settings.announcement}
        </div>
      ) : null}
      <header
        className={`sticky top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-500 ${
          scrolled ? "bg-paper/85 backdrop-blur-xl shadow-[0_1px_0_rgba(21,18,15,.08)]" : "bg-transparent"
        }`}
        onMouseLeave={() => setMega(false)}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label={settings.siteName}>
            {/\.(png|svg|webp)$/i.test(settings.logo) ? (
              <span className={`inline-flex items-center rounded-full px-3.5 py-2 transition-colors duration-500 ${onDark ? "bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,.6)]" : "bg-transparent"}`}>
                <Image src={settings.logo} alt={settings.siteName} width={150} height={40} className="h-8 w-auto sm:h-9" priority />
              </span>
            ) : (
              <>
                <span className={`grid h-10 w-10 place-items-center rounded-full ${onDark ? "bg-white text-ink" : "bg-ink text-white"} font-display text-lg transition-colors duration-500`}>{settings.siteName.charAt(0)}</span>
                <span className={`font-display text-[1.45rem] tracking-[-0.02em] ${onDark ? "text-white" : "text-ink"} transition-colors duration-500`}>
                  {settings.siteName}
                </span>
              </>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <div key={item.href} onMouseEnter={() => item.href === "/products" && setMega(true)}>
                  <Link
                    href={item.href}
                    className={`link-underline relative px-4 py-2 text-[0.9rem] font-medium transition-colors duration-300 ${
                      onDark ? "text-white/80 hover:text-white" : "text-ink/75 hover:text-ink"
                    }`}
                  >
                    {item.label}
                    {active ? <motion.span layoutId="nav-dot" className="absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" /> : null}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Magnetic strength={0.25}>
              <a href={wa} target="_blank" rel="noreferrer" className={`btn ${onDark ? "btn-outline-light" : "btn-ghost"} !py-3`}>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link href="/builder" className="btn btn-accent !py-3">
                Build yours <ArrowUpRight className="arrow h-4 w-4" />
              </Link>
            </Magnetic>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className={`lg:hidden grid h-11 w-11 place-items-center rounded-full ${onDark ? "bg-white/10 text-white" : "bg-ink/5 text-ink"}`}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mega ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-full hidden lg:block"
            >
              <div className="container-x">
                <div className="mt-2 rounded-[1.5rem] bg-white p-6 shadow-[0_40px_80px_-30px_rgba(21,18,15,.35)] ring-1 ring-line">
                  <div className="grid grid-cols-4 gap-4">
                    {categories.map((c) => (
                      <Link key={c.id} href={`/products/${c.slug}`} className="group flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-paper">
                        <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-paper-2">
                          {c.image ? <Image src={c.image} alt="" fill sizes="80px" className="object-cover transition-transform duration-700 group-hover:scale-110" /> : null}
                        </span>
                        <span>
                          <span className="block font-display text-[1.05rem] leading-tight">{c.name}</span>
                          <span className="block text-xs text-muted mt-0.5">{c.tagline}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                    <span className="text-muted">Manufacturer direct since {settings.foundedYear}</span>
                    <Link href="/products" className="font-semibold inline-flex items-center gap-1">View all products <ArrowUpRight className="h-4 w-4" /></Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-paper lg:hidden overflow-y-auto"
            data-lenis-prevent
          >
            <div className="container-x pt-28 pb-16">
              <motion.ul initial="hidden" animate="show" transition={{ staggerChildren: 0.06, delayChildren: 0.1 }} className="space-y-2">
                {nav.map((item) => (
                  <motion.li key={item.href} variants={{ hidden: { y: 30, opacity: 0 }, show: { y: 0, opacity: 1 } }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <Link href={item.href} className="font-display display-soft block text-[2.6rem] leading-[1.1] tracking-[-0.02em]">{item.label}</Link>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-10 grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <Link key={c.id} href={`/products/${c.slug}`} className="rounded-xl bg-white px-4 py-3 text-sm font-medium ring-1 ring-line">{c.name}</Link>
                ))}
              </div>
              <div className="mt-10 flex flex-col gap-3">
                <a href={wa} className="btn btn-primary justify-center"><MessageCircle className="h-4 w-4" /> Chat on WhatsApp</a>
                <a href={`tel:${settings.primaryPhone.replace(/\s/g, "")}`} className="btn btn-ghost justify-center">Call {settings.primaryPhone}</a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
