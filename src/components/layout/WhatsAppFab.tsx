"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/format";

export function WhatsAppFab({ number, siteName }: { number: string; siteName: string }) {
  const pathname = usePathname();
  if (!number || pathname.startsWith("/builder")) return null;
  return (
    <a
      href={waLink(number, `Hi ${siteName}, I have a question about your furniture.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      data-cursor="Chat"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_20px_40px_-15px_rgba(37,211,102,.7)] transition-transform duration-500 hover:scale-105"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
      <MessageCircle className="relative h-6 w-6" />
    </a>
  );
}
