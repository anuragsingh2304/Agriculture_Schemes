import { format, parseISO } from "date-fns"

export function formatDate(date: Date | string, formatStr = "PPP"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatDateTime(date: Date | string, formatStr = "PPp"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, formatStr)
}
