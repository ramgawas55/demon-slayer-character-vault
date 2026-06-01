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
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <Link href="/" className="ds-logo flex-shrink-0">
            Demon Slayer Vault
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/upload" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 transition hover:text-white sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Upload
            </Link>
            <Link href="/admin" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 transition hover:text-white sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="relative flex-1 flex flex-col"
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
