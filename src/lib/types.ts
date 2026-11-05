export type Id = string;

export interface HeroSlide {
  id: Id;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaHref: string;
}

export interface Category {
  id: Id;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  order: number;
}

export interface Product {
  id: Id;
  slug: string;
  name: string;
  categoryId: Id;
  shortDescription: string;
  description: string;
  price: number | null; // in INR, null = price on request
  compareAtPrice: number | null;
  images: string[];
  featured: boolean;
  badge: string; // e.g. "New", "Bestseller"
  materials: string[];
  dimensions: string;
  warrantyYears: number;
  inStock: boolean;
  order: number;
  builderModel: BuilderModelId | "";
}

export interface Banner {
  id: Id;
  eyebrow: string;
  title: string;
  image: string;
  href: string;
}

export interface Stat {
  id: Id;
  value: string;
  label: string;
}

export interface ValueItem {
  id: Id;
  title: string;
  text: string;
}

export interface ProcessStep {
  id: Id;
  title: string;
  text: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  intro: string;
  story: string[]; // paragraphs
  heroImage: string;
  galleryImages: string[];
  stats: Stat[];
  values: ValueItem[];
  process: ProcessStep[];
}

export interface Testimonial {
  id: Id;
  name: string;
  location: string;
  text: string;
  rating: number; // 1-5
}

export interface Branch {
  id: Id;
  name: string;
  address: string;
  phones: string[];
  email: string;
  mapQuery: string;
  hours: string;
}

export interface Settings {
  siteName: string;
  tagline: string;
  logo: string;
  foundedYear: number;
  whatsapp: string; // digits with country code
  primaryPhone: string;
  primaryEmail: string;
  announcement: string;
  instagram: string;
  facebook: string;
  youtube: string;
  seoTitle: string;
  seoDescription: string;
  footerNote: string;
  showPrices: boolean;
  currencySymbol: string;
}

export type BuilderModelId = "sofa" | "chair" | "bed" | "dining";

export interface BuilderSwatch {
  id: Id;
  name: string;
  hex: string;
  price: number; // extra cost
}

export interface BuilderModel {
  id: BuilderModelId;
  name: string;
  basePrice: number;
  description: string;
}

export interface BuilderConfig {
  models: BuilderModel[];
  fabrics: BuilderSwatch[];
  woods: BuilderSwatch[];
  seatPrice: number; // per extra seat (sofa)
  storagePrice: number; // bed storage
  extensionPrice: number; // dining extension
  leadTimeWeeks: number;
}

export interface Enquiry {
  id: Id;
  name: string;
  phone: string;
  email: string;
  message: string;
  product: string; // product name or builder summary
  config: Record<string, string> | null;
  createdAt: string; // ISO
  status: "new" | "contacted" | "closed";
}

export interface AdminUser {
  username: string;
  passwordHash: string; // scrypt "salt:hash"
}

export interface Faq {
  id: Id;
  question: string;
  answer: string;
}

export interface CareSection {
  id: Id;
  title: string;
  text: string;
}

export interface CareContent {
  title: string;
  intro: string;
  sections: CareSection[];
}

export interface Database {
  settings: Settings;
  hero: HeroSlide[];
  banners: Banner[];
  categories: Category[];
  products: Product[];
  about: AboutContent;
  testimonials: Testimonial[];
  branches: Branch[];
  builder: BuilderConfig;
  faqs: Faq[];
  care: CareContent;
  enquiries: Enquiry[];
  admin: AdminUser;
}
