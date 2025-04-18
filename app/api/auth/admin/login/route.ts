import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    // Get user from database
    const users = await executeQuery<any[]>({
      query: "SELECT * FROM users WHERE name = ? AND role = ?",
      values: [username, "admin"],
    })

    if (users.length === 0) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    // Generate token
    const token = generateToken(user.id, user.role)

    // Create response
    const response = NextResponse.json(
      { message: "Login successful", user: { id: user.id, name: user.name, role: user.role } },
      { status: 200 },
    )

    // Set auth cookie
    setAuthCookie(response, token)

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
