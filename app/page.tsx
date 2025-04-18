import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to dashboard if user is logged in, otherwise to login page
  redirect("/login")
}
