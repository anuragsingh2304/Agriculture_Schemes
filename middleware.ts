import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin/dashboard")

  // Check if the path is auth route
  const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/admin/login"

  // Check if the path is admin route
  const isAdminRoute = pathname.startsWith("/admin")

  // If no token and trying to access protected route, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL(isAdminRoute ? "/admin/login" : "/login", request.url)
    return NextResponse.redirect(url)
  }

  // If token exists, verify it
  if (token) {
    const payload = verifyToken(token)

    // If token is invalid and trying to access protected route, redirect to login
    if (!payload && isProtectedRoute) {
      const url = new URL(isAdminRoute ? "/admin/login" : "/login", request.url)
      return NextResponse.redirect(url)
    }

    // If token is valid and user is trying to access auth route, redirect to dashboard
    if (payload && isAuthRoute) {
      const url = new URL(isAdminRoute && payload.role === "admin" ? "/admin/dashboard" : "/dashboard", request.url)
      return NextResponse.redirect(url)
    }

    // If user is trying to access admin route but is not an admin
    if (isAdminRoute && payload && payload.role !== "admin") {
      const url = new URL("/dashboard", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
}
