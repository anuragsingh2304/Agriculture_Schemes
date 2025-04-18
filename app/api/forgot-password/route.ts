import { NextResponse } from "next/server"
import { createPasswordResetToken, getUserByEmail } from "@/lib/db-service"

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

    // Generate token and save to database
    const token = await createPasswordResetToken(email)

    // In a real application, you would send an email with the reset link
    // For this example, we'll just return a success message
    console.log(`Reset link: /reset-password?token=${token}`)

    return NextResponse.json({ message: "If your email is registered, you will receive a reset link" }, { status: 200 })
  } catch (error) {
    console.error("Error processing forgot password request:", error)
    return NextResponse.json({ message: "Error processing request" }, { status: 500 })
  }
}
