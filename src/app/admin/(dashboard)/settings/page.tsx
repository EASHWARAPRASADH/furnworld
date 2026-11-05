import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export default async function AdminSettings() {
  const db = await readDb();
  return (
    <>
      <PageTitle title="Settings" text="Brand, contact details, prices and your admin password." />
      <SettingsEditor initial={db.settings} />
    </>
  );
}
