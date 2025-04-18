import type React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  illustration: string
  className?: string
}

export default function AuthLayout({ children, title, subtitle, illustration, className }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className={cn("w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800", className)}>
        <div className="flex flex-col items-center space-y-6">
          <div className="relative h-40 w-40">
            <Image
              src={illustration || "/placeholder.svg"}
              alt="Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
