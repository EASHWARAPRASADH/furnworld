import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";

export default async function AdminHome() {
  const db = await readDb();
  const newEnq = db.enquiries.filter((e) => e.status === "new");
  const cards = [
    { label: "New enquiries", value: newEnq.length, href: "/admin/enquiries" },
    { label: "Products", value: db.products.length, href: "/admin/products" },
    { label: "Categories", value: db.categories.length, href: "/admin/categories" },
    { label: "Hero slides", value: db.hero.length, href: "/admin/hero" },
  ];
  return (
    <>
      <PageTitle title={`Good day, ${db.admin.username}.`} text="Everything on the website is editable from here. Changes go live immediately." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="admin-card group p-5 transition hover:shadow-lg">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">{c.label}</p>
            <p className="font-display mt-2 text-[2.4rem] leading-none">{c.value}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-muted group-hover:text-ink">Manage <ArrowUpRight className="h-3.5 w-3.5" /></span>
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <h2 className="font-display text-[1.3rem]">Latest enquiries</h2>
          <ul className="mt-4 divide-y divide-line">
            {db.enquiries.slice(0, 6).map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{e.name} <span className="text-muted">· {e.phone}</span></p>
                  <p className="text-xs text-muted">{e.product || "General enquiry"} · {new Date(e.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase ${e.status === "new" ? "bg-accent/10 text-accent" : "bg-paper-2 text-muted"}`}>{e.status}</span>
              </li>
            ))}
            {db.enquiries.length === 0 ? <li className="py-3 text-sm text-muted">No enquiries yet.</li> : null}
          </ul>
        </div>
        <div className="admin-card p-5">
          <h2 className="font-display text-[1.3rem]">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-accent" href="/admin/products/new">Add a new product</Link></li>
            <li><Link className="hover:text-accent" href="/admin/hero">Change the home page hero</Link></li>
            <li><Link className="hover:text-accent" href="/admin/builder">Edit fabrics, woods and builder prices</Link></li>
            <li><Link className="hover:text-accent" href="/admin/settings">Phone numbers, WhatsApp and announcement bar</Link></li>
            <li><Link className="hover:text-accent" href="/" target="_blank">View the live site</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}
