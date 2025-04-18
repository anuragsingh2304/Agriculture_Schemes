"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "hi"

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
}

const initialState: LanguageProviderState = {
  language: "en",
  setLanguage: () => null,
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({ children, defaultLanguage = "en" }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  const value = {
    language,
    setLanguage: (language: Language) => {
      setLanguage(language)
      localStorage.setItem("language", language)
    },
  }

  return <LanguageProviderContext.Provider value={value}>{children}</LanguageProviderContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
