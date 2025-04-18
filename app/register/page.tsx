import RegisterForm from "@/components/auth/register-form"
import AuthLayout from "@/components/auth/auth-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
}

export default function RegisterPage() {
  return (
    <AuthLayout title="Register" subtitle="Please register to login." illustration="/illustrations/register.svg">
      <RegisterForm />
    </AuthLayout>
  )
}
