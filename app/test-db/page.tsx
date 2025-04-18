"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestDatabasePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setStatus("loading")
    setError(null)

    try {
      const response = await fetch("/api/test-db")
      const result = await response.json()

      if (response.ok) {
        setData(result)
        setStatus("success")
      } else {
        setError(result.error || "Failed to connect to database")
        setStatus("error")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setStatus("error")
    }
  }

  useEffect(() => {
    // Test connection when page loads
    testConnection()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Database Connection Test</CardTitle>
          <CardDescription>Check if your MySQL database connection is working properly</CardDescription>
        </CardHeader>

        <CardContent>
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Testing database connection...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="ml-2 text-green-500">Connection Successful</AlertTitle>
                <AlertDescription className="ml-2">Successfully connected to the MySQL database.</AlertDescription>
              </Alert>

              <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="text-sm font-medium">Database Information:</h3>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>Database: {data?.dbInfo?.db_name || "N/A"}</p>
                  <p>User: {data?.dbInfo?.user?.split("@")[0] || "N/A"}</p>
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="text-sm font-medium">Tables in Database:</h3>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {data?.tables && data.tables.length > 0 ? (
                    <ul className="list-inside list-disc">
                      {data.tables.map((table: any, index: number) => (
                        <li key={index}>{Object.values(table)[0]}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tables found in the database.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
              <XCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className="ml-2 text-red-500">Connection Failed</AlertTitle>
              <AlertDescription className="ml-2">
                {error || "Failed to connect to the database. Please check your connection settings."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={testConnection} disabled={status === "loading"} className="w-full">
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection Again"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
