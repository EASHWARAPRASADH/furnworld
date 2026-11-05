import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { EnquiryList } from "@/components/admin/EnquiryList";

export default async function EnquiriesPage() {
  const db = await readDb();
  return (
    <>
      <PageTitle title="Enquiries" text="Quote requests from product pages, the 3D builder and the contact form." />
      <EnquiryList items={db.enquiries} whatsapp={db.settings.whatsapp} />
    </>
  );
}
