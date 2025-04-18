"use client"

import type React from "react"
import { Toast } from "./toast"
import { ToastProvider, useToast } from "./toast-context"

function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <div key={toast.id} className="mb-2">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  )
}

export function Toaster({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  )
}
