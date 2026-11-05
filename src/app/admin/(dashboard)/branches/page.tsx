import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { BranchesEditor } from "@/components/admin/editors";

export default async function AdminBranches() {
  const db = await readDb();
  return (
    <>
      <PageTitle title="Showrooms" text="Addresses, phone numbers and map locations shown in the footer and contact page." />
      <BranchesEditor items={db.branches} />
    </>
  );
}
