import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminInfoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login Information</CardTitle>
          <CardDescription>Use these credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Admin Credentials</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>
                    <strong>Email:</strong> admin@example.com
                  </p>
                  <p>
                    <strong>Password:</strong> admin123
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            These credentials will be created when you run the database setup at{" "}
            <a href="/setup-db" className="text-primary hover:underline">
              /setup-db
            </a>
            .
          </p>

          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Access Admin Panel</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    Go to{" "}
                    <a href="/admin/login" className="text-primary hover:underline">
                      /admin/login
                    </a>{" "}
                    to access the admin panel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
