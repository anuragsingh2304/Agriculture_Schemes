"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/admin/header"
import AdminSidebar from "@/components/admin/sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check for auth token in localStorage
    const token = localStorage.getItem("admin_auth_token")

    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  // Show nothing during authentication check on client
  if (!isClient) {
    return null
  }

  // If not authenticated, don't render the dashboard
  if (!isAuthenticated) {
    return null
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
