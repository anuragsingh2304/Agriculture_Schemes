import AdminLoginForm from "@/components/auth/admin-login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to admin panel",
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to access the admin panel</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
