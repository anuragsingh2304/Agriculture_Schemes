import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ isAdmin: false, message: "Not authenticated" }, { status: 401 })
    }

    const isAdmin = session.user.role === "admin"

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error("Error checking admin status:", error)
    return NextResponse.json({ isAdmin: false, message: "Error checking admin status" }, { status: 500 })
  }
}
