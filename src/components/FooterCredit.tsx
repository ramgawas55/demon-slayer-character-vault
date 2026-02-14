"use client"

import { motion, useReducedMotion } from "framer-motion"

export default function FooterCredit() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <footer className="border-t border-white/10 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 text-sm text-white/60">
          <div className="flex flex-wrap items-center gap-2">
            <span>Forged and Engineered by</span>
            <motion.span
              className="group relative inline-flex items-center font-semibold text-white/80"
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      textShadow: "0 0 12px rgba(236,72,153,0.65)",
                    }
              }
              transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
            >
              <span className="pointer-events-none absolute inset-y-0 -left-6 w-10 translate-x-0 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition duration-500 group-hover:translate-x-24 group-hover:opacity-100" />
              Ram Gawas
            </motion.span>
          </div>
          <div className="text-xs uppercase tracking-[0.35em] text-white/40">
            DevOps • Cloud Engineer • Creative Systems
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ramgawas"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-white/30 hover:text-white"
          >
            <GitHubIcon className="h-4 w-4 transition duration-300 group-hover:scale-110" />
          </a>
          <a
            href="https://www.linkedin.com/in/ram-gawas"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-white/30 hover:text-white"
          >
            <LinkedInIcon className="h-4 w-4 transition duration-300 group-hover:scale-110" />
          </a>
        </div>
      </div>
    </footer>
  )
}

type IconProps = { className?: string }

function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.36-1.34-3.36-1.34-.46-1.17-1.13-1.48-1.13-1.48-.92-.64.07-.63.07-.63 1.02.07 1.56 1.06 1.56 1.06.9 1.56 2.36 1.11 2.94.85.09-.66.36-1.1.65-1.36-2.21-.25-4.53-1.12-4.53-4.97 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.7.12 2.5.35 1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.21 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.86-2.33 4.72-4.55 4.97.37.32.7.95.7 1.9v2.82c0 .27.18.58.69.48A10 10 0 0012 2z" />
    </svg>
  )
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M5.2 8.2H2.4v13.4h2.8V8.2zM3.8 3.2a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2zM21.6 13.4c0-3.2-1.7-4.7-4-4.7-1.9 0-2.7 1.1-3.2 1.8v-1.5h-2.8c.04 1 .04 13.4 0 13.4h2.8v-7.5c0-.4.03-.8.15-1.1.33-.8 1.1-1.6 2.4-1.6 1.7 0 2.4 1.2 2.4 3v7.2h2.8v-7z" />
    </svg>
  )
}
