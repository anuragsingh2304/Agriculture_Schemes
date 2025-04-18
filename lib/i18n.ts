"use client"

import { useLanguage } from "@/contexts/language-context"
import enTranslations from "@/locales/en.json"
import hiTranslations from "@/locales/hi.json"
import frTranslations from "@/locales/fr.json"

type TranslationKey = string

export function useTranslation() {
  const { language } = useLanguage()

  const translations = {
    en: enTranslations,
    hi: hiTranslations,
    fr: frTranslations,
  }

  const t = (key: TranslationKey) => {
    const keys = key.split(".")
    let value = translations[language]

    for (const k of keys) {
      if (value[k] === undefined) {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
      value = value[k]
    }

    return value
  }

  return { t }
}
