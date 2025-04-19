import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

// This is a temporary endpoint to set up an admin user
// You should remove this in production
export async function GET(request: NextRequest) {
  try {
    // Check if admin user already exists
    const admins = await executeQuery<any[]>({
      query: "SELECT * FROM users WHERE role = ?",
      values: ["admin"],
    })

    if (admins.length > 0) {
      return NextResponse.json({ message: "Admin user already exists" }, { status: 200 })
    }

    // Create admin user
    const username = "admin"
    const password = "admin123" // You should change this in production
    const passwordHash = await hashPassword(password)

    await executeQuery({
      query: "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      values: [username, "admin@example.com", passwordHash, "admin"],
    })

    return NextResponse.json({ message: "Admin user created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
