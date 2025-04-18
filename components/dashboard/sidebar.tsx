"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Database, Home, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

export default function Sidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: Home },
    { name: t("analytics"), href: "/dashboard/analytics", icon: BarChart },
    { name: t("users"), href: "/dashboard/users", icon: Users },
    { name: t("settings"), href: "/dashboard/settings", icon: Settings },
    { name: "Test Database", href: "/test-db", icon: Database },
    { name: "Setup Database", href: "/setup-db", icon: Database },
  ]

  return (
    <div className="hidden border-r bg-background md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <span className="text-xl font-bold">MyApp</span>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
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
    </div>
  )
}
