"use client"

import { motion, useReducedMotion } from "framer-motion"

const techStack = ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript", "Vercel"]

export default function CreatorSection() {
  const shouldReduceMotion = useReducedMotion()
  const revealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
        viewport: { once: true, amount: 0.35 },
      }

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pb-16">
      <motion.div {...revealProps} className="space-y-6">
        <div className="text-xs uppercase tracking-[0.4em] text-white/60">The Creator</div>
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0b0b14]/80 p-6 shadow-[0_24px_60px_rgba(4,4,10,0.7)] sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(255,255,255,0.06), transparent 60%), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 7px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 9px)",
            }}
          />
          {!shouldReduceMotion && (
            <motion.div
              className="pointer-events-none absolute -inset-16 opacity-40"
              animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.04, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(236,72,153,0.25), transparent 55%), radial-gradient(circle at 80% 70%, rgba(124,58,237,0.25), transparent 60%)",
              }}
            />
          )}
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-white/90">
                  Ram Gawas — DevOps & Security Engineer building high-performance animated web
                  systems inspired by modern UI architecture.
                </p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/ramgawas55"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                View GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ram-gawas-2215a12a7"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
