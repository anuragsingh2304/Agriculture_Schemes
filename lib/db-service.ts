// This file contains server-only database operations
// It should only be imported in server components or API routes

import { hash, compare } from "bcryptjs"
import { randomBytes } from "crypto"
import { prisma } from "./db"

// User operations
export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    })
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  try {
    const hashedPassword = await hash(password, 10)
    return await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    })
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function verifyUserCredentials(email: string, password: string) {
  try {
    const user = await getUserByEmail(email)
    if (!user) return null

    const isValid = await compare(password, user.passwordHash)
    if (!isValid) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Error verifying credentials:", error)
    return null
  }
}

// Password reset operations
export async function createPasswordResetToken(email: string) {
  try {
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    await prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt,
      },
    })

    return token
  } catch (error) {
    console.error("Error creating password reset token:", error)
    throw new Error("Failed to create password reset token")
  }
}

export async function validatePasswordResetToken(token: string) {
  try {
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
    })

    if (!resetToken) return null
    if (resetToken.expiresAt < new Date()) return null

    return resetToken.email
  } catch (error) {
    console.error("Error validating password reset token:", error)
    return null
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const email = await validatePasswordResetToken(token)
    if (!email) return false

    const hashedPassword = await hash(newPassword, 10)

    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    })

    await prisma.passwordReset.delete({
      where: { token },
    })

    return true
  } catch (error) {
    console.error("Error resetting password:", error)
    return false
  }
}

// Admin operations
export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

export async function getUserCount() {
  try {
    return await prisma.user.count()
  } catch (error) {
    console.error("Error getting user count:", error)
    return 0
  }
}
