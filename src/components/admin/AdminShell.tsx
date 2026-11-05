"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Boxes, Building2, ExternalLink, Image as ImageIcon, Inbox, LayoutDashboard, LogOut, MessageSquareQuote, Package, Settings, Tags, UserRound } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import type { ReactNode } from "react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/hero", label: "Home page", icon: ImageIcon },
  { href: "/admin/about", label: "About page", icon: UserRound },
  { href: "/admin/pages", label: "FAQ & care", icon: BookOpen },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/branches", label: "Showrooms", icon: Building2 },
  { href: "/admin/builder", label: "3D builder", icon: Boxes },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children, username, newEnquiries }: { children: ReactNode; username: string; newEnquiries: number }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="font-display text-[1.3rem] tracking-[-0.02em]">Furn World <span className="text-muted text-sm">admin</span></Link>
          <Link href="/" target="_blank" className="text-xs text-muted hover:text-ink inline-flex items-center gap-1">Site <ExternalLink className="h-3 w-3" /></Link>
        </div>
        <nav className="admin-nav flex gap-1 overflow-x-auto px-3 pb-3 scrollbar-none lg:flex-col lg:overflow-visible">
          {items.map((it) => {
            const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
            return (
              <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined} className="shrink-0">
                <it.icon className="h-4 w-4" /> {it.label}
                {it.href === "/admin/enquiries" && newEnquiries > 0 ? <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold text-white">{newEnquiries}</span> : null}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction} className="hidden lg:block absolute bottom-0 left-0 right-0 border-t border-line p-4">
          <p className="mb-2 truncate text-xs text-muted">Signed in as {username}</p>
          <button className="flex items-center gap-2 text-sm text-muted hover:text-ink"><LogOut className="h-4 w-4" /> Sign out</button>
        </form>
      </aside>
      <main className="px-6 py-8 lg:px-10">{children}</main>
    </div>
  );
}
