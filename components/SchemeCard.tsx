import Link from "next/link"
import Image from "next/image"
import type { Scheme } from "@/utils/mockdata"
import texts from "@/language/en.json"
import { ArrowRight } from "lucide-react"

interface SchemeCardProps {
  scheme: Scheme
}

export default function SchemeCard({ scheme }: SchemeCardProps) {
  // Generate a random pastel background color for the icon
  const colors = [
    "bg-green-100 text-green-600",
    "bg-blue-100 text-blue-600",
    "bg-yellow-100 text-yellow-600",
    "bg-purple-100 text-purple-600",
    "bg-red-100 text-red-600",
  ]

  const colorIndex = Number.parseInt(scheme._id) % colors.length
  const colorClass = colors[colorIndex]

  // Get first letter of scheme title for the icon
  const firstLetter = scheme.title.charAt(0)

  // Generate image query based on scheme title
  const imageQuery = encodeURIComponent(`agricultural scheme related to ${scheme.title.toLowerCase()}`)

  return (
    <div className="card hover:shadow-lg transition-shadow border-t-4 border-t-green-600">
      <div className="relative h-40 w-full mb-3 overflow-hidden rounded-t-lg">
        <Image
          src={scheme.imageUrl || `/placeholder.svg?height=200&width=400&query=${imageQuery}`}
          alt={scheme.title}
          fill
          className="object-cover"
        />
        {scheme.schemeType && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  scheme.schemeType === "central"
                    ? "bg-blue-100 text-blue-800"
                    : scheme.schemeType === "state"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {scheme.schemeType === "central"
                  ? "Central Scheme"
                  : scheme.schemeType === "state"
                    ? `State Scheme${scheme.state ? `: ${scheme.state}` : ""}`
                    : scheme.schemeType}
              </span>
              {scheme.applicationDeadline && (
                <span className="text-xs text-white">Deadline: {scheme.applicationDeadline}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-1">
        <div className="flex items-start mb-3">
          <div
            className={`w-10 h-10 rounded-lg ${colorClass} dark:bg-opacity-20 flex items-center justify-center font-bold mr-3 flex-shrink-0`}
          >
            {firstLetter}
          </div>
          <h3 className="text-md font-semibold text-gray-800 dark:text-white">{scheme.title}</h3>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{scheme.shortDescription}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {scheme.documents.slice(0, 2).map((doc, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
            >
              {doc.split(" ")[0]}
            </span>
          ))}
          {scheme.documents.length > 2 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
              +{scheme.documents.length - 2} more
            </span>
          )}
        </div>

        <Link href={`/scheme-details/${scheme._id}`} className="btn-primary inline-flex items-center gap-1 group">
          {texts.common.readMore}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
