"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { LayoutDashboard, Users, Settings, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  isAdmin?: boolean
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)

  const routes = isAdmin
    ? [
        {
          title: t("common.dashboard"),
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: t("common.users"),
          href: "/admin/users",
          icon: Users,
        },
        {
          title: t("common.settings"),
          href: "/admin/settings",
          icon: Settings,
        },
      ]
    : [
        {
          title: t("common.dashboard"),
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: t("common.settings"),
          href: "/settings",
          icon: Settings,
        },
      ]

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && <span className="text-lg font-semibold">{isAdmin ? t("common.admin") : "GamingSoft"}</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-md hover:bg-accent">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              pathname === route.href ? "bg-primary text-primary-foreground" : "hover:bg-accent",
            )}
          >
            <route.icon className="h-5 w-5" />
            {!collapsed && <span>{route.title}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}
