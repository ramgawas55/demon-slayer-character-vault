"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import CinematicCloudBackground from "./CinematicCloudBackground"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative flex min-h-screen flex-col">
      <CinematicCloudBackground />
      <header className="ds-navbar">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="ds-logo">
            Demon Slayer Vault
          </Link>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="relative flex-1"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
