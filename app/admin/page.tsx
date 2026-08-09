import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = { title: "GharBari admin" };

export default async function AdminPage() {
  // middleware.ts already guarantees a valid session reaches this point;
  // we re-read it here only to greet the signed-in admin by name.
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(token);

  return <AdminDashboard adminName={session?.name || "Admin"} />;
}
