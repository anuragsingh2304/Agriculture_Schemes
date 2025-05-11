"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronRight,
  Home,
  FileText,
  User,
  Users,
  Settings,
  LogIn,
  Menu,
  X,
  Leaf,
  LayoutDashboard,
} from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } w-64`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-green-600 dark:text-green-400">Farmer Schemes</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Government Portal</p>
        </div>

        <nav className="p-4">
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-medium">Main Navigation</p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    isActive("/")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Home size={16} />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/user/dashboard"
                  className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    isActive("/user/dashboard")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/schemes"
                  className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    pathname.includes("/scheme") && !pathname.includes("/admin")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <FileText size={16} />
                  Schemes
                </Link>
              </li>
              <li>
                <Link
                  href="/crops"
                  className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    pathname.includes("/crop") && !pathname.includes("/admin")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Leaf size={16} />
                  Crops
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-medium">User</p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/login"
                  className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    isActive("/login")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <LogIn size={16} />
                  User Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    isActive("/register")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <User size={16} />
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-medium">Administration</p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin/login"
                  className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    isActive("/admin/login")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    // For demo purposes, we'll simulate admin login
                    localStorage.setItem("adminAuthenticated", "true")
                  }}
                >
                  <LogIn size={16} />
                  Admin Login
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    pathname.includes("/admin") && !isActive("/admin/login")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Users size={16} />
                  Admin Panel
                  <ChevronRight size={16} className="ml-auto" />
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Settings size={16} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">Help & Support</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">support@farmerschemes.gov.in</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
