"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Menu, Moon, Sun, Globe, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/lib/i18n"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = pathname.startsWith("/admin")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-2">
            <span className="text-xl font-bold">{isAdmin ? t("common.admin") : "GamingSoft"}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">{t("common.theme")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>{t("common.light")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>{t("common.dark")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{t("common.language")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage("en")}>{t("common.english")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("hi")}>{t("common.hindi")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("fr")}>{t("common.french")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">{t("common.logout")}</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t("common.login")}</Button>
              </Link>
              <Link href="/register">
                <Button>{t("common.register")}</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            {session ? (
              <>
                <div className="flex items-center justify-between">
                  <span>{t("common.theme")}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setTheme("light")}>
                      {t("common.light")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setTheme("dark")}>
                      {t("common.dark")}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("common.language")}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setLanguage("en")}>
                      {t("common.english")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setLanguage("hi")}>
                      {t("common.hindi")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setLanguage("fr")}>
                      {t("common.french")}
                    </Button>
                  </div>
                </div>
                <Button variant="outline" onClick={() => signOut()}>
                  {t("common.logout")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    {t("common.login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full">{t("common.register")}</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
