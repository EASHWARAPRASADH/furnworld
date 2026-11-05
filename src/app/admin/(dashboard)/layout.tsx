import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";



async function Gate({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const db = await readDb();
  const newEnquiries = db.enquiries.filter((e) => e.status === "new").length;
  return <AdminShell username={session.username} newEnquiries={newEnquiries}>{children}</AdminShell>;
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
