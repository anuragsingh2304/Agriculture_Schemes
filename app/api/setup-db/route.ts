import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Create users table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create password_resets table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (email),
        INDEX (token)
      )
    `)

    // Check if admin user exists
    const [adminUsers] = await db.query("SELECT id FROM users WHERE email = ? AND role = ?", [
      "admin@example.com",
      "admin",
    ])

    // Create admin user if it doesn't exist
    if (adminUsers.length === 0) {
      // Password: admin123 (hashed with SHA-256)
      const adminPasswordHash = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"

      await db.query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)", [
        "Admin User",
        "admin@example.com",
        adminPasswordHash,
        "admin",
      ])
    }

    return NextResponse.json({
      status: "success",
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database setup failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
