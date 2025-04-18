"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, ChevronLeft, Home, Settings, Shield, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  toggleSidebar?: () => void
  isMobile?: boolean
}

export default function AdminSidebar({ toggleSidebar, isMobile = false }: AdminSidebarProps) {
  const pathname = usePathname()
  const { t } = useTranslation()

  const navigation = [
    { name: t("dashboard"), href: "/admin/dashboard", icon: Home },
    { name: t("users"), href: "/admin/dashboard/users", icon: Users },
    { name: t("roles"), href: "/admin/dashboard/roles", icon: Shield },
    { name: t("analytics"), href: "/admin/dashboard/analytics", icon: BarChart },
    { name: t("settings"), href: "/admin/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-800">
      <div className="flex h-16 flex-shrink-0 items-center justify-between border-b px-4">
        <span className="text-xl font-bold">Admin Panel</span>
        {isMobile && toggleSidebar && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
              )}
            >
              <item.icon
                className={cn(
                  pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  "mr-3 flex-shrink-0 h-5 w-5",
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
