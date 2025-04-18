import LoginForm from "@/components/auth/login-form"
import AuthLayout from "@/components/auth/auth-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <AuthLayout title="Login" subtitle="Please Sign In to continue." illustration="/illustrations/login.svg">
      <LoginForm />
    </AuthLayout>
  )
}
