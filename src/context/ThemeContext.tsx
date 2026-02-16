"use client"

import { animate, useReducedMotion } from "framer-motion"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type { UniformTheme } from "../data/characters"

type ThemeContextValue = {
  theme: UniformTheme
  setTheme: (theme: UniformTheme) => void
}

const defaultTheme: UniformTheme = {
  primary: "#7c83ff",
  secondary: "#94a3b8",
  accent: "#7c83ff",
  background: "#0e1116",
  glow: "#7c83ff",
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const cssVars = {
  primary: "--primary",
  secondary: "--secondary",
  accent: "--accent",
  background: "--bg-base",
  glow: "--glow",
} as const

export function ThemeProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const [theme, setThemeState] = useState<UniformTheme>(defaultTheme)
  const animationsRef = useRef<ReturnType<typeof animate>[]>([])

  const applyTheme = useCallback(
    (next: UniformTheme, immediate: boolean) => {
      if (typeof document === "undefined") {
        return
      }
      const root = document.documentElement
      const computed = getComputedStyle(root)
      animationsRef.current.forEach((animation) => animation.stop())
      animationsRef.current = []
      Object.entries(cssVars).forEach(([key, variable]) => {
        const targetValue = next[key as keyof UniformTheme]
        if (immediate || reduceMotion) {
          root.style.setProperty(variable, targetValue)
          return
        }
        const currentValue = computed.getPropertyValue(variable).trim() || targetValue
        const animation = animate(currentValue, targetValue, {
          duration: 0.7,
          ease: "easeInOut",
          onUpdate: (value) => {
            root.style.setProperty(variable, value)
          },
        })
        animationsRef.current.push(animation)
      })
    },
    [reduceMotion]
  )

  const setTheme = useCallback(
    (next: UniformTheme) => {
      setThemeState(next)
      applyTheme(next, false)
    },
    [applyTheme]
  )

  useEffect(() => {
    applyTheme(theme, true)
  }, [applyTheme, theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
