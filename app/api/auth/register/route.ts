import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { generateToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Insert user into database
    const [result] = await db.query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)", [
      name,
      email,
      passwordHash,
      "user",
    ])

    const userId = result.insertId

    // Generate JWT token
    const token = generateToken({
      id: userId,
      email,
      role: "user",
    })

    // Create response
    const response = NextResponse.json(
      {
        user: {
          id: userId,
          name,
          email,
          role: "user",
        },
        token,
      },
      { status: 201 },
    )

    // Set cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
