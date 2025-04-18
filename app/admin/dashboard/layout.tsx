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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
      {/* Mobile sidebar with animation */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setIsSidebarOpen(false)}></div>
        <div
          className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-800 border-r transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar toggleSidebar={() => setIsSidebarOpen(false)} isMobile={true} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <AdminSidebar />
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
