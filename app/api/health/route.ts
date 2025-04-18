import { NextResponse } from "next/server"
import { getUserCount } from "@/lib/db-service"

export async function GET() {
  try {
    const userCount = await getUserCount()

    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
