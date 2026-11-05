import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { CareEditor, FaqEditor } from "@/components/admin/PagesEditor";

export default async function AdminPages() {
  const db = await readDb();
  return (
    <>
      <PageTitle title="FAQ & care pages" text="The questions page and the care & warranty page." />
      <h2 className="font-display mb-3 text-[1.3rem]">Questions & answers</h2>
      <FaqEditor items={db.faqs} />
      <h2 className="font-display mb-3 mt-12 text-[1.3rem]">Care & warranty</h2>
      <CareEditor initial={db.care} />
    </>
  );
}
