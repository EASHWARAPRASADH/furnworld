import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { TestimonialsEditor } from "@/components/admin/editors";

export default async function AdminTestimonials() {
  const db = await readDb();
  return (
    <>
      <PageTitle title="Testimonials" text="Customer quotes shown on the home and about pages." />
      <TestimonialsEditor items={db.testimonials} />
    </>
  );
}
