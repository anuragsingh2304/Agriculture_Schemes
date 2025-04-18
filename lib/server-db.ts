import { prisma } from "./db"

// Server-only database operations
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export async function createUser(data: { name: string; email: string; passwordHash: string }) {
  return prisma.user.create({
    data,
  })
}

export async function createPasswordReset(data: { email: string; token: string; expiresAt: Date }) {
  return prisma.passwordReset.create({
    data,
  })
}

export async function getPasswordResetByToken(token: string) {
  return prisma.passwordReset.findUnique({
    where: {
      token,
    },
  })
}

export async function deletePasswordReset(token: string) {
  return prisma.passwordReset.delete({
    where: {
      token,
    },
  })
}
