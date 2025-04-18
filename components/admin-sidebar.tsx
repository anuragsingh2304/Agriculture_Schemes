"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Home, Users, Settings, Shield } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="hidden w-64 flex-shrink-0 border-r bg-white dark:bg-gray-800 md:block">
      <div className="flex h-16 items-center justify-center border-b">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
      </div>
      <div className="py-4">
        <nav className="space-y-1 px-2">
          <Link
            href="/admin/dashboard"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive("/admin/dashboard")
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            <Home className="mr-3 h-5 w-5" />
            {t("dashboard")}
          </Link>
          <Link
            href="/admin/dashboard/users"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive("/admin/dashboard/users")
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Users
          </Link>
          <Link
            href="/admin/dashboard/roles"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive("/admin/dashboard/roles")
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            <Shield className="mr-3 h-5 w-5" />
            Roles
          </Link>
          <Link
            href="/admin/dashboard/settings"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive("/admin/dashboard/settings")
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>
    </div>
  )
}
