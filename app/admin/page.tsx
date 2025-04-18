"use client"

import { useSession } from "next-auth/react"
import { useTranslation } from "@/lib/i18n"

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("pages.admin.title")}</h1>
        <p className="text-muted-foreground">
          {t("pages.admin.welcome")}, {session?.user?.name}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{t("pages.admin.totalUsers")}</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{t("pages.admin.newUsers")}</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{t("pages.admin.activeUsers")}</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight">{t("pages.admin.userStats")}</h2>
        <div className="rounded-md border mt-4">
          <div className="p-4">
            <p className="text-muted-foreground">No user data available</p>
          </div>
        </div>
      </div>
    </div>
  )
}
