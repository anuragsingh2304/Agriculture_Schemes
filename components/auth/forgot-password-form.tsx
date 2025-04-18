"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast-context"
import { useTranslation } from "@/hooks/use-translation"

export default function ForgotPasswordForm() {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request")
      }

      setSubmitted(true)
    } catch (error) {
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process request",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full text-center">
        <h2 className="text-xl font-semibold">{t("checkYourEmail")}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t("resetLinkSent")}</p>
        <Button className="mt-4" variant="outline" onClick={() => setSubmitted(false)}>
          {t("tryAgain")}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#15293f]" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("loading")}
          </>
        ) : (
          t("resetPassword")
        )}
      </Button>

      <div className="text-center text-sm">
        <Link href="/login" className="font-medium text-primary hover:text-primary/90">
          {t("backToLogin")}
        </Link>
      </div>
    </form>
  )
}
