"use client";

import type { Banner, Branch, Category, HeroSlide, Testimonial } from "@/lib/types";
import {
  deleteBannerAction, deleteBranchAction, deleteCategoryAction, deleteHeroAction, deleteTestimonialAction, reorderAction,
  saveBannerAction, saveBranchAction, saveCategoryAction, saveHeroAction, saveTestimonialAction,
} from "@/lib/actions";
import { CrudList } from "./CrudList";
import { Area, Field, ImageField, TagsField, Text } from "./fields";

export function HeroEditor({ items }: { items: HeroSlide[] }) {
  return (
    <CrudList<HeroSlide>
      items={items}
      blank={() => ({ id: "", eyebrow: "", title: "", subtitle: "", image: "", ctaText: "Explore", ctaHref: "/products" })}
      title={(s) => s.title}
      subtitle={(s) => s.eyebrow}
      thumb={(s) => s.image}
      onSave={saveHeroAction}
      onDelete={deleteHeroAction}
      onReorder={(ids) => reorderAction("hero", ids)}
      addLabel="Add slide"
      renderFields={(s, set) => (
        <>
          <Field label="Small line above the title"><Text value={s.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
          <Field label="Title"><Text value={s.title} onChange={(v) => set({ title: v })} /></Field>
          <Field label="Subtitle"><Area rows={2} value={s.subtitle} onChange={(v) => set({ subtitle: v })} /></Field>
          <ImageField label="Background image" value={s.image} onChange={(v) => set({ image: v })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button text"><Text value={s.ctaText} onChange={(v) => set({ ctaText: v })} /></Field>
            <Field label="Button link" hint="e.g. /products/sofa or /builder"><Text value={s.ctaHref} onChange={(v) => set({ ctaHref: v })} /></Field>
          </div>
        </>
      )}
    />
  );
}

export function BannersEditor({ items }: { items: Banner[] }) {
  return (
    <CrudList<Banner>
      items={items}
      blank={() => ({ id: "", eyebrow: "", title: "", image: "", href: "/products" })}
      title={(b) => b.title}
      subtitle={(b) => b.eyebrow}
      thumb={(b) => b.image}
      onSave={saveBannerAction}
      onDelete={deleteBannerAction}
      onReorder={(ids) => reorderAction("banners", ids)}
      addLabel="Add banner"
      renderFields={(b, set) => (
        <>
          <Field label="Small line"><Text value={b.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
          <Field label="Title"><Text value={b.title} onChange={(v) => set({ title: v })} /></Field>
          <ImageField value={b.image} onChange={(v) => set({ image: v })} />
          <Field label="Link"><Text value={b.href} onChange={(v) => set({ href: v })} /></Field>
        </>
      )}
    />
  );
}

export function CategoriesEditor({ items }: { items: Category[] }) {
  return (
    <CrudList<Category>
      items={items}
      blank={() => ({ id: "", slug: "", name: "", tagline: "", description: "", image: "", order: items.length + 1 })}
      title={(c) => c.name}
      subtitle={(c) => `/products/${c.slug}`}
      thumb={(c) => c.image}
      onSave={saveCategoryAction}
      onDelete={deleteCategoryAction}
      onReorder={(ids) => reorderAction("categories", ids)}
      addLabel="Add category"
      renderFields={(c, set) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><Text value={c.name} onChange={(v) => set({ name: v })} /></Field>
            <Field label="URL slug" hint="Blank = generated from the name"><Text value={c.slug} onChange={(v) => set({ slug: v })} /></Field>
          </div>
          <Field label="Tagline"><Text value={c.tagline} onChange={(v) => set({ tagline: v })} /></Field>
          <Field label="Description"><Area rows={2} value={c.description} onChange={(v) => set({ description: v })} /></Field>
          <ImageField value={c.image} onChange={(v) => set({ image: v })} />
        </>
      )}
    />
  );
}

export function TestimonialsEditor({ items }: { items: Testimonial[] }) {
  return (
    <CrudList<Testimonial>
      items={items}
      blank={() => ({ id: "", name: "", location: "", text: "", rating: 5 })}
      title={(t) => t.name}
      subtitle={(t) => t.text.slice(0, 80)}
      onSave={saveTestimonialAction}
      onDelete={deleteTestimonialAction}
      onReorder={(ids) => reorderAction("testimonials", ids)}
      addLabel="Add testimonial"
      renderFields={(t, set) => (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Customer name"><Text value={t.name} onChange={(v) => set({ name: v })} /></Field>
            <Field label="Location"><Text value={t.location} onChange={(v) => set({ location: v })} /></Field>
            <Field label="Rating (1 to 5)"><Text type="number" value={t.rating} onChange={(v) => set({ rating: Number(v) })} /></Field>
          </div>
          <Field label="Quote"><Area rows={3} value={t.text} onChange={(v) => set({ text: v })} /></Field>
        </>
      )}
    />
  );
}

export function BranchesEditor({ items }: { items: Branch[] }) {
  return (
    <CrudList<Branch>
      items={items}
      blank={() => ({ id: "", name: "", address: "", phones: [], email: "", mapQuery: "", hours: "" })}
      title={(b) => b.name}
      subtitle={(b) => b.address}
      onSave={saveBranchAction}
      onDelete={deleteBranchAction}
      onReorder={(ids) => reorderAction("branches", ids)}
      addLabel="Add showroom"
      renderFields={(b, set) => (
        <>
          <Field label="Name"><Text value={b.name} onChange={(v) => set({ name: v })} /></Field>
          <Field label="Address"><Area rows={2} value={b.address} onChange={(v) => set({ address: v })} /></Field>
          <TagsField label="Phone numbers" value={b.phones} onChange={(v) => set({ phones: v })} placeholder="+91 … then Enter" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email"><Text value={b.email} onChange={(v) => set({ email: v })} /></Field>
            <Field label="Opening hours"><Text value={b.hours} onChange={(v) => set({ hours: v })} /></Field>
          </div>
          <Field label="Map search text" hint="What to search on Google Maps for the embedded map"><Text value={b.mapQuery} onChange={(v) => set({ mapQuery: v })} /></Field>
        </>
      )}
    />
  );
}
