import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { AboutEditor } from "@/components/admin/AboutEditor";

export default async function AdminAbout() {
  const db = await readDb();
  return (
    <>
      <PageTitle title="About page" text="Your story, numbers, values and the process steps (also shown on the home page)." />
      <AboutEditor initial={db.about} />
    </>
  );
}
