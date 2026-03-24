import AdminDashboard from "@/components/admin/AdminDashboard"
import AdminLogin from "@/components/admin/AdminLogin"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { readSiteContent } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const authenticated = isAdminAuthenticated()

  if (!authenticated) {
    return <AdminLogin />
  }

  const content = await readSiteContent()
  return <AdminDashboard initialContent={content} />
}
