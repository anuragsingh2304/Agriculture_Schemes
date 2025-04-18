import type React from "react"
import AdminHeader from "@/components/admin/header"
import AdminSidebar from "@/components/admin/sidebar"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check for admin auth token in cookies
  const cookieStore = cookies()
  const token = cookieStore.get("admin_auth_token")

  // If no token, redirect to admin login
  if (!token) {
    redirect("/admin/login")
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
