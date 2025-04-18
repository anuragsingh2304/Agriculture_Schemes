"use client"

import { useLanguage } from "@/providers/language-provider"
import en from "@/lang/en"
import hi from "@/lang/hi"

export function useTranslation() {
  const { language } = useLanguage()

  const translations = {
    en,
    hi,
  }

  const t = (key: string) => {
    return translations[language][key] || key
  }

  return { t }
}
