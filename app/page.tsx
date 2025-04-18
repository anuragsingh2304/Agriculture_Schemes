import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Next.js MySQL App</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Full-stack application with Next.js and MySQL</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>User Panel</CardTitle>
              <CardDescription>Access the user dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Login or register to access the user dashboard.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Register</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Login to the admin panel to manage users and settings.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild>
                <Link href="/admin/login">Admin Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin-info">Admin Info</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Tools</CardTitle>
              <CardDescription>Test and setup your database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Test your database connection and set up the required tables.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild>
                <Link href="/test-db">Test Database</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/setup-db">Setup Database</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
