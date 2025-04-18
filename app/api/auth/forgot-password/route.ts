import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const users = await executeQuery<any[]>({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email],
    })

    if (users.length === 0) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json(
        { message: "If your email is registered, you will receive a reset link" },
        { status: 200 },
      )
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Delete any existing reset tokens for this user
    await executeQuery({
      query: "DELETE FROM password_resets WHERE email = ?",
      values: [email],
    })

    // Insert new reset token
    await executeQuery({
      query: "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
      values: [email, token, expiresAt],
    })

    // In a real application, you would send an email with the reset link
    // For this example, we'll just return a success message

    return NextResponse.json({ message: "If your email is registered, you will receive a reset link" }, { status: 200 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
