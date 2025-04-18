import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import AuthLayout from "@/components/auth/auth-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
      illustration="/illustrations/forgot-password.svg"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
