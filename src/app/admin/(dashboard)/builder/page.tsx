import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { BuilderEditor } from "@/components/admin/BuilderEditor";

export default async function AdminBuilder() {
  const db = await readDb();
  return (
    <>
      <PageTitle title="3D builder" text="Fabrics, wood finishes and the pricing used for live estimates. Colours update the 3D models instantly." />
      <BuilderEditor initial={db.builder} />
    </>
  );
}
