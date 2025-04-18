import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Test the database connection with a simple query
    const [result] = await db.query("SELECT 1 as connected")

    // Get database information (safely)
    const [dbInfo] = await db.query("SELECT DATABASE() as db_name, USER() as user")

    // Get tables in the database
    const [tables] = await db.query("SHOW TABLES")

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      connected: result[0].connected === 1,
      dbInfo: dbInfo[0],
      tables,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
