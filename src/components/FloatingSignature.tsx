"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const SECRET = "nichirin"

export default function FloatingSignature() {
  const shouldReduceMotion = useReducedMotion()
  const [expanded, setExpanded] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const bufferRef = useRef("")

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        return
      }
      const target = event.target as HTMLElement | null
      if (target?.closest("input, textarea, [contenteditable='true']")) {
        return
      }
      if (event.key.length !== 1) {
        return
      }
      const key = event.key.toLowerCase()
      if (!/^[a-z]$/.test(key)) {
        return
      }
      bufferRef.current = (bufferRef.current + key).slice(-SECRET.length)
      if (bufferRef.current === SECRET) {
        setIsOpen(true)
        bufferRef.current = ""
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const signatureTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 220, damping: 22 }

  return (
    <>
      <motion.button
        type="button"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/8 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-white/70 max-sm:bottom-3 max-sm:right-3"
        animate={{ width: expanded ? 190 : 46 }}
        transition={signatureTransition}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
      >
        <span className="text-xs font-semibold">🗡 RG</span>
        <motion.span
          className="whitespace-nowrap text-white/70"
          animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -6 }}
          transition={signatureTransition}
        >
          Forged by Ram Gawas
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b14] p-6 text-center text-white/80 shadow-[0_20px_60px_rgba(4,4,10,0.7)]"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
              onClick={(event) => event.stopPropagation()}
            >
              <motion.div
                className="pointer-events-none absolute -inset-16 opacity-50"
                animate={
                  shouldReduceMotion ? undefined : { opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }
                }
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background:
                    "radial-gradient(circle at 40% 40%, rgba(244,63,94,0.3), transparent 60%), radial-gradient(circle at 70% 60%, rgba(249,115,22,0.3), transparent 65%)",
                }}
              />
              <div className="relative space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                  Engineered with Nichirin-level precision.
                </p>
                <p className="text-base font-semibold text-white/80">Crafted by Ram Gawas.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
