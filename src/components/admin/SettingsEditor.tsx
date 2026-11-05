"use client";

import { useState } from "react";
import type { Settings } from "@/lib/types";
import { changePasswordAction, saveSettingsAction } from "@/lib/actions";
import { Area, Field, ImageField, SaveBar, Text, Toggle } from "./fields";
import { useSave } from "./useSave";

export function SettingsEditor({ initial }: { initial: Settings }) {
  const [s, setS] = useState(initial);
  const set = (patch: Partial<Settings>) => setS((x) => ({ ...x, ...patch }));
  const { pending, message, error, run } = useSave();
  const pw = useSave();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");

  return (
    <div className="space-y-6">
      <div className="admin-card space-y-4 p-5">
        <h2 className="font-display text-[1.2rem]">Brand</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Site name"><Text value={s.siteName} onChange={(v) => set({ siteName: v })} /></Field>
          <Field label="Tagline"><Text value={s.tagline} onChange={(v) => set({ tagline: v })} /></Field>
          <Field label="Founded year"><Text type="number" value={s.foundedYear} onChange={(v) => set({ foundedYear: Number(v) })} /></Field>
        </div>
        <ImageField label="Logo" value={s.logo} onChange={(v) => set({ logo: v })} />
        <Field label="Announcement bar" hint="Leave blank to hide"><Text value={s.announcement} onChange={(v) => set({ announcement: v })} /></Field>
        <Field label="Footer note"><Text value={s.footerNote} onChange={(v) => set({ footerNote: v })} /></Field>
      </div>
      <div className="admin-card space-y-4 p-5">
        <h2 className="font-display text-[1.2rem]">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="WhatsApp number" hint="Digits with country code, e.g. 9184384…"><Text value={s.whatsapp} onChange={(v) => set({ whatsapp: v })} /></Field>
          <Field label="Primary phone"><Text value={s.primaryPhone} onChange={(v) => set({ primaryPhone: v })} /></Field>
          <Field label="Primary email"><Text value={s.primaryEmail} onChange={(v) => set({ primaryEmail: v })} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Instagram URL"><Text value={s.instagram} onChange={(v) => set({ instagram: v })} /></Field>
          <Field label="Facebook URL"><Text value={s.facebook} onChange={(v) => set({ facebook: v })} /></Field>
          <Field label="YouTube URL"><Text value={s.youtube} onChange={(v) => set({ youtube: v })} /></Field>
        </div>
      </div>
      <div className="admin-card space-y-4 p-5">
        <h2 className="font-display text-[1.2rem]">Prices & SEO</h2>
        <Toggle value={s.showPrices} onChange={(v) => set({ showPrices: v })} label="Show prices on the website (off = 'Price on request')" />
        <Field label="Currency symbol"><Text value={s.currencySymbol} onChange={(v) => set({ currencySymbol: v })} /></Field>
        <Field label="Browser / Google title"><Text value={s.seoTitle} onChange={(v) => set({ seoTitle: v })} /></Field>
        <Field label="Google description"><Area rows={2} value={s.seoDescription} onChange={(v) => set({ seoDescription: v })} /></Field>
      </div>
      <SaveBar pending={pending} message={message} error={error} onSave={() => run(() => saveSettingsAction(s))} />

      <div className="admin-card space-y-4 p-5">
        <h2 className="font-display text-[1.2rem]">Change admin password</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current password"><input className="input" type="password" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
          <Field label="New password (8+ characters)"><input className="input" type="password" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
        </div>
        <div className="flex items-center gap-3">
          <button disabled={pw.pending} onClick={() => pw.run(() => changePasswordAction({ current: cur, next }), { message: "Password updated.", then: (r) => { if (r.ok) { setCur(""); setNext(""); } } })} className="btn btn-ghost !py-2.5">Update password</button>
          {pw.message ? <span className="text-sm text-green-700">{pw.message}</span> : null}
          {pw.error ? <span className="text-sm text-accent">{pw.error}</span> : null}
        </div>
      </div>
    </div>
  );
}
