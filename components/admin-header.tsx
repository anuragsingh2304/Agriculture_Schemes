"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        </div>

        <div className="w-10">{/* Empty div to maintain flex spacing */}</div>
      </div>

      {isMenuOpen && (
        <div className="border-t md:hidden">
          <div className="space-y-1 px-2 py-3 sm:px-3">
            <Link
              href="/admin/dashboard"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/dashboard/users"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              Users
            </Link>
            <Link
              href="/admin/dashboard/settings"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
