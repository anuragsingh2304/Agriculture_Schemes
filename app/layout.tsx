import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import texts from "@/language/en.json"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: texts?.common?.appName || "Default App Name", // Provide a fallback
  description: texts?.home?.subtitle || "Default Subtitle", // Provide a fallback
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-grow">
            <main className="flex-grow overflow-x-hidden w-full">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
