import SchemeCard from "@/components/SchemeCard"
import texts from "@/language/en.json"
import Image from "next/image"
import Link from "next/link"
import type { Scheme } from "@/utils/mockdata"

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/schemes`, {
    cache: "no-store"
  })
  const schemes: Scheme[] = await res.json()
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section - Full Width */}
      <div className="relative h-80 mb-8 w-full">
        <Image src="/images/hero-bg.png" alt="Farming landscape" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-md font-bold text-white mb-2">{texts.home.title}</h1>
              <p className="text-sm text-white/90 mb-6">{texts.home.subtitle}</p>
              <Link href="#schemes" className="btn-primary">
                Explore Schemes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content with container */}
      <div className="container mx-auto px-4 pb-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-md font-bold text-green-600 dark:text-green-400">5+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Government Schemes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-md font-bold text-green-600 dark:text-green-400">₹10,000 Cr+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Funds Allocated</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-md font-bold text-green-600 dark:text-green-400">1M+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Farmers Benefited</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-md font-bold text-green-600 dark:text-green-400">24/7</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Support Available</div>
          </div>
        </div>

        {/* Schemes Section */}
        <section id="schemes" className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-md font-bold text-gray-900 dark:text-white mb-1">Available Schemes</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Find the right government support for your farm
              </p>
            </div>
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded-full">
              {schemes.length} Schemes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme._id} scheme={scheme} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-8">
          <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-1 text-center">
            <h2 className="text-md font-bold text-gray-900 dark:text-white mb-2">
              Need Help Finding the Right Scheme?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Our experts can guide you through the application process
            </p>
            <Link href="/" className="btn-primary">
              book Call
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
