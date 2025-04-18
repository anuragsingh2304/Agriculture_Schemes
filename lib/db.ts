import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Handle Prisma initialization errors
process.on("beforeExit", () => {
  if (globalForPrisma.prisma) {
    globalForPrisma.prisma.$disconnect()
  }
})
