"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Home, Users, Settings, Shield, LogOut, Sun, Moon, Globe } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="hidden w-64 flex-shrink-0 border-r bg-white dark:bg-gray-800 md:block">
      <div className="flex h-16 items-center justify-center border-b">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
      </div>

      {/* Controls moved from header to sidebar top */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="ml-2">Theme</span>
          </button>

          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <Globe className="h-5 w-5" />
            <span className="ml-2">{language === "en" ? "EN" : "HI"}</span>
          </button>
        </div>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-2">
          <Link
            href="/admin/dashboard"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive("/admin/dashboard")
                ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white"
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
                ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white"
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
                ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white"
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
                ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Logout button at the bottom of sidebar */}
      <div className="absolute bottom-0 w-full border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          {t("logout")}
        </button>
      </div>
    </div>
  )
}
