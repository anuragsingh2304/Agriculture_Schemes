"use client"

import type React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "./toast-context"

export type ToastActionElement = React.ReactNode

export interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export function Toast({ toast }: { toast: ToastProps }) {
  const { removeToast } = useToast()

  const { id, title, description, type = "default" } = toast

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
        {
          "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100": type === "default",
          "bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-100": type === "success",
          "bg-red-50 text-red-900 dark:bg-red-900 dark:text-red-100": type === "error",
          "bg-yellow-50 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100": type === "warning",
          "bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-100": type === "info",
        },
      )}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <button
        onClick={() => removeToast(id)}
        className="absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
