"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { submitEnquiryAction } from "@/lib/enquiry-actions";
import { waLink } from "@/lib/format";

export function EnquiryForm({
  product = "",
  config = null,
  whatsapp,
  siteName,
  compact = false,
  onDone,
}: {
  product?: string;
  config?: Record<string, string> | null;
  whatsapp: string;
  siteName: string;
  compact?: boolean;
  onDone?: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const summary = [product, config ? Object.entries(config).map(([k, v]) => `${k}: ${v}`).join(", ") : ""].filter(Boolean).join(" · ");
  const wa = waLink(whatsapp, `Hi ${siteName}, I'd like a quote${summary ? ` for ${summary}` : ""}. ${form.message}`.trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await submitEnquiryAction({ ...form, product, config, website: "" });
      if (res.ok) { setDone(true); onDone?.(); } else setError(res.error);
    });
  };

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-paper-2 p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink text-white"><Check className="h-5 w-5" /></span>
          <h3 className="font-display mt-4 text-[1.5rem]">Thank you, {form.name.split(" ")[0]}.</h3>
          <p className="mt-2 text-sm text-muted">We&apos;ve received your enquiry and will call you back within one working day.</p>
          <a href={wa} target="_blank" rel="noreferrer" className="btn btn-ghost mt-6"><MessageCircle className="h-4 w-4" /> Or continue on WhatsApp</a>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={compact ? "space-y-3" : "space-y-4"}>
          {summary ? <p className="rounded-xl bg-paper-2 px-4 py-3 text-sm"><span className="font-semibold">Enquiring about:</span> {summary}</p> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="enq-name">Name</label>
              <input id="enq-name" className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <label className="label" htmlFor="enq-phone">Phone</label>
              <input id="enq-phone" className="input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91" inputMode="tel" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="enq-email">Email <span className="normal-case tracking-normal text-muted/70">(optional)</span></label>
            <input id="enq-email" className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div>
            <label className="label" htmlFor="enq-msg">Message</label>
            <textarea id="enq-msg" className="input min-h-[110px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Room size, timeline, anything we should know" />
          </div>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <div className="flex flex-wrap gap-3 pt-1">
            <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Send enquiry
            </button>
            <a href={wa} target="_blank" rel="noreferrer" className="btn btn-ghost"><MessageCircle className="h-4 w-4" /> WhatsApp instead</a>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
