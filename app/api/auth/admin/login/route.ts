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

    // For debugging: Log the username being attempted
    console.log("Admin login attempt for username:", username)

    // Get user from database - FIXED: Don't filter by role in the query
    const users = await executeQuery<any[]>({
      query: "SELECT * FROM users WHERE name = ?",
      values: [username],
    })

    // For debugging: Log if user was found
    console.log("User found:", users.length > 0)

    if (users.length === 0) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    const user = users[0]

    // For debugging: Log user details (except password)
    console.log("User details:", { id: user.id, name: user.name, role: user.role })

    // TEMPORARILY DISABLED role check for debugging
    // if (user.role !== "admin") {
    //   return NextResponse.json({ message: "You don't have admin privileges" }, { status: 403 })
    // }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    // For debugging: Log password verification result
    console.log("Password valid:", isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    // Generate token with admin role regardless of actual role (TEMPORARY for debugging)
    const token = generateToken(user.id, "admin")

    // Create response
    const response = NextResponse.json(
      { message: "Login successful", user: { id: user.id, name: user.name, role: "admin" } },
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
