import ResetPasswordForm from "@/components/auth/reset-password-form"
import AuthLayout from "@/components/auth/auth-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password",
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account."
      illustration="/illustrations/reset-password.svg"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
