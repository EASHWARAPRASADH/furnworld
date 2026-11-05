"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { readDb, updateDb, newId, slugify } from "./db";
import { createSession, destroySession, requireAdmin } from "./auth";
import { hashPassword, verifyPassword } from "./password";
import { CONTENT_TAG } from "./content";
import type {
  AboutContent, Banner, Branch, BuilderConfig, CareContent, Category, Enquiry, Faq, HeroSlide, Product, Settings, Testimonial,
} from "./types";

type Result = { ok: true; id?: string } | { ok: false; error: string };

function fail(e: unknown): Result {
  if (e instanceof z.ZodError) return { ok: false, error: e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  return { ok: false, error: e instanceof Error ? e.message : "Something went wrong" };
}

/* ---------------- Auth ---------------- */

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const db = await readDb();
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  const envOk = envUser && envPass && username === envUser && password === envPass;
  const dbOk = username === db.admin.username && verifyPassword(password, db.admin.passwordHash);
  if (!envOk && !dbOk) {
    await new Promise((r) => setTimeout(r, 400));
    return { error: "Incorrect username or password." };
  }
  await createSession(username);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(input: { current: string; next: string }): Promise<Result> {
  try {
    await requireAdmin();
    const schema = z.object({ current: z.string().min(1), next: z.string().min(8, "Use at least 8 characters") });
    const { current, next } = schema.parse(input);
    await updateDb((db) => {
      if (!verifyPassword(current, db.admin.passwordHash)) throw new Error("Current password is incorrect");
      db.admin.passwordHash = hashPassword(next);
    });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ---------------- Settings ---------------- */

const settingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string(),
  logo: z.string(),
  foundedYear: z.coerce.number().int().min(1900).max(2100),
  whatsapp: z.string(),
  primaryPhone: z.string(),
  primaryEmail: z.string(),
  announcement: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  youtube: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  footerNote: z.string(),
  showPrices: z.boolean(),
  currencySymbol: z.string().min(1),
});

export async function saveSettingsAction(input: Settings): Promise<Result> {
  try {
    await requireAdmin();
    const data = settingsSchema.parse(input);
    await updateDb((db) => { db.settings = data; });
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (e) { return fail(e); }
}

/* ---------------- Generic list helpers ---------------- */

type ListKey = "hero" | "banners" | "categories" | "products" | "testimonials" | "branches" | "faqs";

async function upsert<T extends { id: string }>(key: ListKey, item: T): Promise<Result> {
  await requireAdmin();
  const id = item.id || newId(key.slice(0, 4));
  await updateDb((db) => {
    const list = db[key] as unknown as T[];
    const idx = list.findIndex((x) => x.id === id);
    const next = { ...item, id };
    if (idx >= 0) list[idx] = next; else list.push(next);
  });
  updateTag(CONTENT_TAG);
  return { ok: true, id };
}

async function remove(key: ListKey, id: string): Promise<Result> {
  await requireAdmin();
  await updateDb((db) => {
    const list = db[key] as unknown as { id: string }[];
    const idx = list.findIndex((x) => x.id === id);
    if (idx >= 0) list.splice(idx, 1);
  });
  updateTag(CONTENT_TAG);
  return { ok: true };
}

export async function reorderAction(key: ListKey, ids: string[]): Promise<Result> {
  try {
    await requireAdmin();
    await updateDb((db) => {
      const list = db[key] as unknown as { id: string; order?: number }[];
      const byId = new Map(list.map((x) => [x.id, x]));
      const ordered = ids.map((id) => byId.get(id)).filter(Boolean) as typeof list;
      const rest = list.filter((x) => !ids.includes(x.id));
      const next = [...ordered, ...rest];
      next.forEach((x, i) => { if ("order" in x) x.order = i + 1; });
      (db[key] as unknown as typeof list) = next;
    });
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (e) { return fail(e); }
}

/* ---------------- Hero & banners ---------------- */

const heroSchema = z.object({
  id: z.string(), eyebrow: z.string(), title: z.string().min(1), subtitle: z.string(),
  image: z.string().min(1, "Add an image"), ctaText: z.string(), ctaHref: z.string(),
});
export async function saveHeroAction(input: HeroSlide): Promise<Result> {
  try { return await upsert("hero", heroSchema.parse(input)); } catch (e) { return fail(e); }
}
export async function deleteHeroAction(id: string): Promise<Result> {
  try { return await remove("hero", id); } catch (e) { return fail(e); }
}

const bannerSchema = z.object({ id: z.string(), eyebrow: z.string(), title: z.string().min(1), image: z.string().min(1), href: z.string() });
export async function saveBannerAction(input: Banner): Promise<Result> {
  try { return await upsert("banners", bannerSchema.parse(input)); } catch (e) { return fail(e); }
}
export async function deleteBannerAction(id: string): Promise<Result> {
  try { return await remove("banners", id); } catch (e) { return fail(e); }
}

/* ---------------- Categories ---------------- */

const categorySchema = z.object({
  id: z.string(), slug: z.string(), name: z.string().min(1), tagline: z.string(), description: z.string(),
  image: z.string(), order: z.coerce.number(),
});
export async function saveCategoryAction(input: Category): Promise<Result> {
  try {
    const data = categorySchema.parse(input);
    data.slug = slugify(data.slug || data.name);
    return await upsert("categories", data);
  } catch (e) { return fail(e); }
}
export async function deleteCategoryAction(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const db = await readDb();
    if (db.products.some((p) => p.categoryId === id)) return { ok: false, error: "Move or delete the products in this category first." };
    return await remove("categories", id);
  } catch (e) { return fail(e); }
}

/* ---------------- Products ---------------- */

const productSchema = z.object({
  id: z.string(), slug: z.string(), name: z.string().min(1), categoryId: z.string().min(1, "Pick a category"),
  shortDescription: z.string(), description: z.string(),
  price: z.number().nullable(), compareAtPrice: z.number().nullable(),
  images: z.array(z.string()), featured: z.boolean(), badge: z.string(),
  materials: z.array(z.string()), dimensions: z.string(), warrantyYears: z.coerce.number(),
  inStock: z.boolean(), order: z.coerce.number(), builderModel: z.enum(["", "sofa", "chair", "bed", "dining"]),
});
export async function saveProductAction(input: Product): Promise<Result> {
  try {
    const data = productSchema.parse(input);
    data.slug = slugify(data.slug || data.name);
    const db = await readDb();
    if (db.products.some((p) => p.slug === data.slug && p.id !== data.id)) data.slug = `${data.slug}-${Date.now().toString(36).slice(-4)}`;
    return await upsert("products", data);
  } catch (e) { return fail(e); }
}
export async function deleteProductAction(id: string): Promise<Result> {
  try { return await remove("products", id); } catch (e) { return fail(e); }
}
export async function duplicateProductAction(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const db = await readDb();
    const src = db.products.find((p) => p.id === id);
    if (!src) return { ok: false, error: "Product not found" };
    const copy: Product = { ...src, id: "", name: `${src.name} (copy)`, slug: `${src.slug}-copy`, order: db.products.length + 1 };
    return await saveProductAction(copy);
  } catch (e) { return fail(e); }
}

/* ---------------- About ---------------- */

const aboutSchema = z.object({
  eyebrow: z.string(), title: z.string().min(1), intro: z.string(), story: z.array(z.string()),
  heroImage: z.string(), galleryImages: z.array(z.string()),
  stats: z.array(z.object({ id: z.string(), value: z.string(), label: z.string() })),
  values: z.array(z.object({ id: z.string(), title: z.string(), text: z.string() })),
  process: z.array(z.object({ id: z.string(), title: z.string(), text: z.string() })),
});
export async function saveAboutAction(input: AboutContent): Promise<Result> {
  try {
    await requireAdmin();
    const data = aboutSchema.parse(input);
    for (const list of [data.stats, data.values, data.process]) list.forEach((x) => { if (!x.id) x.id = newId("ab"); });
    await updateDb((db) => { db.about = data; });
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (e) { return fail(e); }
}

/* ---------------- Testimonials & branches ---------------- */

const testimonialSchema = z.object({ id: z.string(), name: z.string().min(1), location: z.string(), text: z.string().min(1), rating: z.coerce.number().min(1).max(5) });
export async function saveTestimonialAction(input: Testimonial): Promise<Result> {
  try { return await upsert("testimonials", testimonialSchema.parse(input)); } catch (e) { return fail(e); }
}
export async function deleteTestimonialAction(id: string): Promise<Result> {
  try { return await remove("testimonials", id); } catch (e) { return fail(e); }
}

const branchSchema = z.object({ id: z.string(), name: z.string().min(1), address: z.string(), phones: z.array(z.string()), email: z.string(), mapQuery: z.string(), hours: z.string() });
export async function saveBranchAction(input: Branch): Promise<Result> {
  try { return await upsert("branches", branchSchema.parse(input)); } catch (e) { return fail(e); }
}
export async function deleteBranchAction(id: string): Promise<Result> {
  try { return await remove("branches", id); } catch (e) { return fail(e); }
}

/* ---------------- FAQ & care ---------------- */

const faqSchema = z.object({ id: z.string(), question: z.string().min(1), answer: z.string().min(1) });
export async function saveFaqAction(input: Faq): Promise<Result> {
  try { return await upsert("faqs", faqSchema.parse(input)); } catch (e) { return fail(e); }
}
export async function deleteFaqAction(id: string): Promise<Result> {
  try { return await remove("faqs", id); } catch (e) { return fail(e); }
}

const careSchema = z.object({ title: z.string().min(1), intro: z.string(), sections: z.array(z.object({ id: z.string(), title: z.string(), text: z.string() })) });
export async function saveCareAction(input: CareContent): Promise<Result> {
  try {
    await requireAdmin();
    const data = careSchema.parse(input);
    data.sections.forEach((x) => { if (!x.id) x.id = newId("care"); });
    await updateDb((db) => { db.care = data; });
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (e) { return fail(e); }
}

/* ---------------- Builder ---------------- */

const swatch = z.object({ id: z.string(), name: z.string().min(1), hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #AABBCC"), price: z.coerce.number() });
const builderSchema = z.object({
  models: z.array(z.object({ id: z.enum(["sofa", "chair", "bed", "dining"]), name: z.string(), basePrice: z.coerce.number(), description: z.string() })),
  fabrics: z.array(swatch).min(1), woods: z.array(swatch).min(1),
  seatPrice: z.coerce.number(), storagePrice: z.coerce.number(), extensionPrice: z.coerce.number(), leadTimeWeeks: z.coerce.number(),
});
export async function saveBuilderAction(input: BuilderConfig): Promise<Result> {
  try {
    await requireAdmin();
    const data = builderSchema.parse(input);
    for (const list of [data.fabrics, data.woods]) list.forEach((x) => { if (!x.id) x.id = newId("sw"); });
    await updateDb((db) => { db.builder = data; });
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (e) { return fail(e); }
}

/* ---------------- Enquiries ---------------- */

export async function setEnquiryStatusAction(id: string, status: Enquiry["status"]): Promise<Result> {
  try {
    await requireAdmin();
    await updateDb((db) => { const e = db.enquiries.find((x) => x.id === id); if (e) e.status = status; });
    return { ok: true };
  } catch (e) { return fail(e); }
}
export async function deleteEnquiryAction(id: string): Promise<Result> {
  try {
    await requireAdmin();
    await updateDb((db) => { db.enquiries = db.enquiries.filter((x) => x.id !== id); });
    return { ok: true };
  } catch (e) { return fail(e); }
}
