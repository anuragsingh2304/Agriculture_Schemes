import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, mobileNumber, password } = await request.json()

    // Validate input
    if (!username || !mobileNumber || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await executeQuery<any[]>({
      query: "SELECT * FROM users WHERE name = ?",
      values: [username],
    })

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: "Username already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Insert user into database
    await executeQuery({
      query: "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      values: [username, mobileNumber, passwordHash, "user"],
    })

    return NextResponse.json({ message: "Registration successful" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
