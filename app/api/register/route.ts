import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { createUser, getUserByEmail } from "@/lib/server-db"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await createUser({
      name,
      email,
      passwordHash: hashedPassword,
    })

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ message: "Error registering user" }, { status: 500 })
  }
}
