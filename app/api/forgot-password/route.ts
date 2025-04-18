import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { createPasswordReset, getUserByEmail } from "@/lib/server-db"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Check if user exists
    const user = await getUserByEmail(email)

    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return NextResponse.json(
        { message: "If your email is registered, you will receive a reset link" },
        { status: 200 },
      )
    }

    // Generate token
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Save token to database
    await createPasswordReset({
      email,
      token,
      expiresAt,
    })

    // In a real application, you would send an email with the reset link
    // For this example, we'll just return a success message
    console.log(`Reset link: /reset-password?token=${token}`)

    return NextResponse.json({ message: "If your email is registered, you will receive a reset link" }, { status: 200 })
  } catch (error) {
    console.error("Error processing forgot password request:", error)
    return NextResponse.json({ message: "Error processing request" }, { status: 500 })
  }
}
