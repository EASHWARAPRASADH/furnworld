import type { Branch, Category, Faq, Product, Settings } from "./types";

export const SITE_URL = (process.env.SITE_URL || "https://www.furnworld.net").replace(/\/$/, "");

export function abs(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd(settings: Settings, branches: Branch[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": `${SITE_URL}/#organization`,
    name: settings.siteName,
    url: SITE_URL,
    logo: abs(settings.logo),
    image: abs("/images/brand/about.jpg"),
    description: settings.seoDescription,
    telephone: settings.primaryPhone,
    email: settings.primaryEmail,
    foundingDate: String(settings.foundedYear),
    priceRange: "₹₹",
    sameAs: [settings.instagram, settings.facebook, settings.youtube].filter(Boolean),
    address: branches.map((b) => ({ "@type": "PostalAddress", streetAddress: b.address, addressCountry: "IN" })),
    department: branches.map((b) => ({
      "@type": "FurnitureStore",
      name: `${settings.siteName} · ${b.name}`,
      telephone: b.phones[0],
      email: b.email,
      address: { "@type": "PostalAddress", streetAddress: b.address, addressCountry: "IN" },
      openingHours: b.hours,
    })),
  };
}

export function websiteJsonLd(settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: settings.siteName,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/products?q={search_term_string}`, "query-input": "required name=search_term_string" },
  };
}

export function productJsonLd(product: Product, category: Category | null, settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.images.map(abs),
    sku: product.slug,
    brand: { "@type": "Brand", name: settings.siteName },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    category: category?.name,
    material: product.materials.join(", ") || undefined,
    url: abs(`/product/${product.slug}`),
    ...(settings.showPrices && product.price !== null
      ? { offers: { "@type": "Offer", priceCurrency: "INR", price: product.price, availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder", url: abs(`/product/${product.slug}`), seller: { "@id": `${SITE_URL}/#organization` } } }
      : { offers: { "@type": "Offer", priceCurrency: "INR", availability: "https://schema.org/PreOrder", url: abs(`/product/${product.slug}`), seller: { "@id": `${SITE_URL}/#organization` }, priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", description: "Quote on request" } } }),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

export function itemListJsonLd(products: Product[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/product/${p.slug}`), name: p.name })),
  };
}
