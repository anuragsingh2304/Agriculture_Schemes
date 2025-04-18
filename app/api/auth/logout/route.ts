import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })

  // Clear the auth cookie
  response.cookies.set({
    name: "auth_token",
    value: "",
    expires: new Date(0),
    path: "/",
  })

  return response
}
