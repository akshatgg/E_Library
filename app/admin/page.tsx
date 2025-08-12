// import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "E-Library - Admin Dashboard",
  description: "Manage your E-Library content, users, and settings",
  openGraph: {
    title: "E-Library - Admin Dashboard",
    description: "Manage your E-Library content, users, and settings",
    type: "website",
  },
}

export default async function AdminPage() {
  // const session = await getSession()

  // Redirect if not logged in or not an admin
  // if (!session || session.role !== "admin") {
  //   redirect("/login")
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your E-Library content, users, and settings</p>
      </div>

      {/* <AdminDashboard user={session} /> */}
    </div>
  )
}
