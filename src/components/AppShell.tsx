"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import GlobalBackground from "./GlobalBackground"

type ThemeKey = "corps" | "upper-moon" | "hashira"

const themeOptions: Array<{ id: ThemeKey; label: string }> = [
  { id: "corps", label: "Corps" },
  { id: "upper-moon", label: "Upper Moon" },
  { id: "hashira", label: "Hashira" },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [theme, setTheme] = useState<ThemeKey>("corps")

  useEffect(() => {
    const stored = window.localStorage.getItem("ds-theme") as ThemeKey | null
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("ds-theme", theme)
  }, [theme])

  return (
    <div className="relative flex min-h-screen flex-col">
      <GlobalBackground />
      <header className="ds-navbar">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="ds-logo">
            Demon Slayer Vault
          </Link>
          <div className="flex items-center gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                data-active={theme === option.id}
                className="ds-button ds-button--compact"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="relative flex-1"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
