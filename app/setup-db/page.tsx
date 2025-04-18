"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react"

export default function SetupDatabasePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const setupDatabase = async () => {
    if (status === "loading") return

    setStatus("loading")
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("/api/setup-db")
      const result = await response.json()

      if (response.ok) {
        setMessage(result.message)
        setStatus("success")
      } else {
        setError(result.error || "Failed to set up database")
        setStatus("error")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setStatus("error")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Database Setup</CardTitle>
          <CardDescription>Create the required tables and admin user for your application</CardDescription>
        </CardHeader>

        <CardContent>
          <Alert className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="ml-2 text-yellow-500">Warning</AlertTitle>
            <AlertDescription className="ml-2">
              This will create the necessary tables in your database if they don't exist. It will also create an admin
              user with email <strong>admin@example.com</strong> and password <strong>admin123</strong>.
            </AlertDescription>
          </Alert>

          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Setting up database...</p>
            </div>
          )}

          {status === "success" && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="ml-2 text-green-500">Setup Successful</AlertTitle>
              <AlertDescription className="ml-2">
                {message || "Database setup completed successfully."}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
              <XCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className="ml-2 text-red-500">Setup Failed</AlertTitle>
              <AlertDescription className="ml-2">
                {error || "Failed to set up the database. Please check your connection settings."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={setupDatabase} disabled={status === "loading"} className="w-full">
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Up...
              </>
            ) : (
              "Set Up Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
