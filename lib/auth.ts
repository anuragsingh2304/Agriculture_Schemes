import type { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "./db"

// Simple password hashing using crypto.subtle
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hashedPassword
}

// Generate a simple JWT token
export function generateToken(userId: number, role: string): string {
  const payload = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  }

  return btoa(JSON.stringify(payload))
}

// Verify token
export function verifyToken(token: string): { userId: number; role: string } | null {
  try {
    const payload = JSON.parse(atob(token))

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null // Token expired
    }

    return { userId: payload.userId, role: payload.role }
  } catch (error) {
    return null
  }
}

// Set auth cookie
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

// Get current user from cookie
export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  try {
    const users = await executeQuery<any[]>({
      query: "SELECT id, name, email, role FROM users WHERE id = ?",
      values: [payload.userId],
    })

    if (users.length === 0) {
      return null
    }

    return users[0]
  } catch (error) {
    return null
  }
}
