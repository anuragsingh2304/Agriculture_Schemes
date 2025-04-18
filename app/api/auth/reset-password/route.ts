import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token, email, password } = await request.json()

    // Validate input
    if (!token || !email || !password) {
      return NextResponse.json({ error: "Token, email, and password are required" }, { status: 400 })
    }

    // Check if token exists and is valid
    const [resetTokens] = await db.query(
      "SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()",
      [email, token],
    )

    if (resetTokens.length === 0) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Hash new password
    const passwordHash = await hashPassword(password)

    // Update user password
    await db.query("UPDATE users SET password_hash = ? WHERE email = ?", [passwordHash, email])

    // Delete used token
    await db.query("DELETE FROM password_resets WHERE email = ?", [email])

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
