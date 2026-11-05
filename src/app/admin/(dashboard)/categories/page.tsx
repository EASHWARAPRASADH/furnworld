import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { CategoriesEditor } from "@/components/admin/editors";

export default async function AdminCategories() {
  const db = await readDb();
  return (
    <>
      <PageTitle title="Categories" text="Rooms and ranges shown in the menu, on the home page and in the collection filters." />
      <CategoriesEditor items={[...db.categories].sort((a, b) => a.order - b.order)} />
    </>
  );
}
