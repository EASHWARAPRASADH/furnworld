import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { BannersEditor, HeroEditor } from "@/components/admin/editors";

export default async function AdminHero() {
  const db = await readDb();
  return (
    <>
      <PageTitle title="Home page" text="Hero slides rotate every 7 seconds. Banners appear below the 3D builder section." />
      <h2 className="font-display mb-3 text-[1.3rem]">Hero slides</h2>
      <HeroEditor items={db.hero} />
      <h2 className="font-display mb-3 mt-12 text-[1.3rem]">Promo banners</h2>
      <BannersEditor items={db.banners} />
    </>
  );
}
