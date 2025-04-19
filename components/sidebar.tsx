"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Home, User, Settings, LogOut, Sun, Moon, Globe } from "lucide-react"

export function Sidebar() {
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
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="hidden w-64 flex-shrink-0 border-r bg-white dark:bg-gray-800 md:block">
      <div className="flex h-16 items-center justify-center border-b">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Panel</h2>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-2">
          <Link
            href="/dashboard"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive("/dashboard")
                ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            <Home className="mr-3 h-5 w-5" />
            {t("dashboard")}
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive("/dashboard/profile")
                ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive("/dashboard/settings")
                ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            {theme === "dark" ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Language switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <Globe className="mr-3 h-5 w-5" />
            {language === "en" ? "हिंदी" : "English"}
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t("logout")}
          </button>
        </nav>
      </div>
    </div>
  )
}
