import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Create response
  const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 })

  // Clear auth cookie
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })

  return response
}
