// Pure JS implementation of password hashing using crypto.subtle
export async function hashPassword(password: string): Promise<string> {
  // Convert password string to ArrayBuffer
  const encoder = new TextEncoder()
  const data = encoder.encode(password)

  // Hash the password using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)

  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}

// Compare password with stored hash
export async function comparePasswords(password: string, storedHash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === storedHash
}

// Generate a random token for password reset
export function generateResetToken(): string {
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
