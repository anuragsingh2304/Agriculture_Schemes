"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { verifyToken } from "@/lib/jwt"

type User = {
  id: number
  name: string
  email: string
  role: string
}

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthProviderState = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const initialState: AuthProviderState = {
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
}

const AuthProviderContext = createContext<AuthProviderState>(initialState)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem("auth_token")

        if (token) {
          // Verify token
          const payload = verifyToken(token)

          if (payload) {
            // Set user from payload
            setUser({
              id: payload.id,
              name: payload.name || "",
              email: payload.email,
              role: payload.role,
            })
          } else {
            // Invalid token
            localStorage.removeItem("auth_token")
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to login")
      }

      // Save token to localStorage
      localStorage.setItem("auth_token", data.token)

      // Set user
      setUser(data.user)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register")
      }

      // Save token to localStorage
      localStorage.setItem("auth_token", data.token)

      // Set user
      setUser(data.user)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Remove token from localStorage
      localStorage.removeItem("auth_token")

      // Clear user
      setUser(null)

      // Redirect to login
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthProviderContext.Provider value={value}>{children}</AuthProviderContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
