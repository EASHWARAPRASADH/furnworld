"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Boxes, MessageCircle } from "lucide-react";
import { Modal } from "./Modal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { waLink } from "@/lib/format";

export function ProductActions({ productName, builderModel, whatsapp, siteName }: { productName: string; builderModel: string; whatsapp: string; siteName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setOpen(true)} className="btn btn-primary">Request a quote <ArrowUpRight className="arrow h-4 w-4" /></button>
        <a href={waLink(whatsapp, `Hi ${siteName}, I'm interested in the ${productName}.`)} target="_blank" rel="noreferrer" className="btn btn-ghost"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
        {builderModel ? (
          <Link href={`/builder?model=${builderModel}`} className="btn btn-accent"><Boxes className="h-4 w-4" /> Customise in 3D</Link>
        ) : null}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Request a quote">
        <EnquiryForm product={productName} whatsapp={whatsapp} siteName={siteName} />
      </Modal>
    </>
  );
}
