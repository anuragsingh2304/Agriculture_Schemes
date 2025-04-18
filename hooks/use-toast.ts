"use client"

import { useToast as useToastContext } from "@/components/ui/toast-context"

export function useToast() {
  return useToastContext()
}
