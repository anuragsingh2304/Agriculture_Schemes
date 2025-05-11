export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div>
              <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="h-6 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
