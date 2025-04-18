// Simple JWT implementation without using jsonwebtoken library
export function generateToken(payload: any): string {
  // Create header
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  // Add expiration to payload (1 week)
  const now = Math.floor(Date.now() / 1000)
  payload.exp = now + 60 * 60 * 24 * 7
  payload.iat = now

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))

  // Create signature (in a real app, use a proper HMAC implementation)
  // This is a simplified version for demonstration
  const signature = btoa(
    JSON.stringify({
      header: encodedHeader,
      payload: encodedPayload,
      secret: process.env.JWT_SECRET || "default_secret",
    }),
  )

  // Return JWT
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyToken(token: string): any {
  try {
    // Split token
    const [encodedHeader, encodedPayload, signature] = token.split(".")

    // Decode payload
    const payload = JSON.parse(atob(encodedPayload))

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      throw new Error("Token expired")
    }

    // In a real app, verify the signature here

    return payload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}
