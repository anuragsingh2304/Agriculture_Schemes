import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateResetToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const [users] = await db.query("SELECT id FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json(
        { message: "If your email is registered, you will receive a password reset link" },
        { status: 200 },
      )
    }

    // Generate reset token
    const token = generateResetToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Delete any existing reset tokens for this email
    await db.query("DELETE FROM password_resets WHERE email = ?", [email])

    // Insert reset token into database
    await db.query("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)", [email, token, expiresAt])

    // In a real application, you would send an email with the reset link
    // For this example, we'll just return the token
    return NextResponse.json(
      {
        message: "If your email is registered, you will receive a password reset link",
        // Only for demonstration purposes
        resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
