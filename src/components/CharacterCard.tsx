"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { Character, type CharacterTheme } from "../data/characters"

type CharacterCardProps = {
  character: Character
}

type ThemeVars = {
  "--c1": string
  "--c2": string
  "--bg1": string
  "--bg2": string
  "--bg3": string
}

type Particle = {
  id: string
  top: string
  left: string
  size: number
  blur: number
  opacity: number
  delay: number
  duration: number
}

const baseThemeVars: ThemeVars = {
  "--c1": "#7c3aed",
  "--c2": "#ec4899",
  "--bg1": "#0f172a",
  "--bg2": "#111827",
  "--bg3": "#030712",
}

const vfxPalette: Record<
  CharacterTheme["vfx"],
  { color: string; accent: string; haze: string }
> = {
  flame: {
    color: "#f97316",
    accent: "#facc15",
    haze: "radial-gradient(circle at 20% 20%, rgba(249,115,22,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(250,204,21,0.25), transparent 50%)",
  },
  water: {
    color: "#38bdf8",
    accent: "#22d3ee",
    haze: "radial-gradient(circle at 30% 20%, rgba(56,189,248,0.35), transparent 50%), radial-gradient(circle at 75% 80%, rgba(34,211,238,0.25), transparent 55%)",
  },
  mist: {
    color: "#94a3b8",
    accent: "#e2e8f0",
    haze: "radial-gradient(circle at 20% 30%, rgba(148,163,184,0.3), transparent 55%), radial-gradient(circle at 70% 70%, rgba(226,232,240,0.2), transparent 60%)",
  },
  lightning: {
    color: "#facc15",
    accent: "#38bdf8",
    haze: "radial-gradient(circle at 25% 25%, rgba(250,204,21,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(56,189,248,0.25), transparent 55%)",
  },
  shadow: {
    color: "#0f172a",
    accent: "#6366f1",
    haze: "radial-gradient(circle at 25% 25%, rgba(99,102,241,0.25), transparent 50%), radial-gradient(circle at 75% 75%, rgba(15,23,42,0.6), transparent 55%)",
  },
  ice: {
    color: "#7dd3fc",
    accent: "#a5f3fc",
    haze: "radial-gradient(circle at 30% 20%, rgba(125,211,252,0.35), transparent 50%), radial-gradient(circle at 70% 80%, rgba(165,243,252,0.25), transparent 55%)",
  },
  blood: {
    color: "#ef4444",
    accent: "#fb7185",
    haze: "radial-gradient(circle at 25% 25%, rgba(239,68,68,0.35), transparent 50%), radial-gradient(circle at 70% 70%, rgba(251,113,133,0.25), transparent 55%)",
  },
}

const motionPresets: Record<
  CharacterTheme["motion"],
  { particles: number; particleDuration: number; pulseDuration: number; spring: { stiffness: number; damping: number } }
> = {
  calm: {
    particles: 8,
    particleDuration: 14,
    pulseDuration: 7,
    spring: { stiffness: 140, damping: 22 },
  },
  aggressive: {
    particles: 12,
    particleDuration: 10,
    pulseDuration: 5,
    spring: { stiffness: 200, damping: 18 },
  },
  chaotic: {
    particles: 16,
    particleDuration: 8,
    pulseDuration: 4,
    spring: { stiffness: 240, damping: 14 },
  },
  heavy: {
    particles: 10,
    particleDuration: 12,
    pulseDuration: 6,
    spring: { stiffness: 160, damping: 26 },
  },
}

const hashSeed = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000
  }
  return hash
}

const createParticles = (count: number, seed: string): Particle[] => {
  let current = hashSeed(seed) || 42
  const next = () => {
    current = (current * 9301 + 49297) % 233280
    return current / 233280
  }
  return Array.from({ length: count }).map((_, index) => {
    const size = 6 + next() * 12
    return {
      id: `${seed}-${index}`,
      top: `${next() * 100}%`,
      left: `${next() * 100}%`,
      size,
      blur: 2 + next() * 6,
      opacity: 0.25 + next() * 0.5,
      delay: next() * 4,
      duration: 6 + next() * 8,
    }
  })
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const [showReveal, setShowReveal] = useState(false)
  const [expandedForm, setExpandedForm] = useState<number | null>(0)
  const [isTouch, setIsTouch] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const matcher = window.matchMedia("(hover: none)")
    const update = () => setIsTouch(matcher.matches || navigator.maxTouchPoints > 0)
    update()
    matcher.addEventListener("change", update)
    return () => matcher.removeEventListener("change", update)
  }, [])

  const powerTitle = useMemo(() => {
    if (character.power.breathingStyle) {
      return "Breathing Style"
    }
    if (character.power.bloodDemonArt) {
      return "Blood Demon Art"
    }
    return "Power"
  }, [character.power.breathingStyle, character.power.bloodDemonArt])

  const powerName = character.power.breathingStyle ?? character.power.bloodDemonArt ?? "Unknown"

  const themeVars = useMemo<ThemeVars>(
    () => ({
      "--c1": character.theme.primaryGlow,
      "--c2": character.theme.secondaryGlow,
      "--bg1": character.theme.bg[0],
      "--bg2": character.theme.bg[1],
      "--bg3": character.theme.bg[2],
    }),
    [character.theme.bg, character.theme.primaryGlow, character.theme.secondaryGlow]
  )

  const motionProfile = motionPresets[character.theme.motion]

  const particles = useMemo(() => {
    if (reduceMotion || !showReveal) {
      return []
    }
    return createParticles(motionProfile.particles, `${character.slug}-${character.theme.vfx}`)
  }, [reduceMotion, showReveal, motionProfile.particles, character.slug, character.theme.vfx])

  const animateVars = showReveal ? themeVars : baseThemeVars
  const boxShadow = showReveal
    ? `0 24px 48px ${character.theme.primaryGlow}55, 0 16px 32px ${character.theme.secondaryGlow}35`
    : "0 16px 28px #0f172a"

  return (
    <motion.div
      whileHover={{
        y: -6,
        transition: reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 18 },
      }}
      className="ds-card group relative"
      style={baseThemeVars as CSSProperties}
      animate={{
        ...animateVars,
        boxShadow,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        ease: "easeInOut",
      }}
      onHoverStart={() => {
        if (!isTouch) {
          setShowReveal(true)
        }
      }}
      onHoverEnd={() => {
        if (!isTouch) {
          setShowReveal(false)
        }
      }}
    >
      <Link
        href={`/characters/${character.slug}`}
        className="block h-full"
        onClick={(event) => {
          if (isTouch && !showReveal) {
            event.preventDefault()
            setShowReveal(true)
          }
        }}
      >
        <div className="relative aspect-[3/4]">
          <Image
            src={character.images.posterUrl}
            alt={`${character.name} poster`}
            fill
            className="object-cover object-center"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
            quality={85}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `linear-gradient(180deg, transparent 30%, var(--c1))`,
            }}
          />
        </div>
        <div className="space-y-2 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            {character.faction}
          </p>
          <h3 className="text-xl font-semibold text-white">{character.name}</h3>
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">{character.rank}</p>
          <p className="text-sm text-white/70 line-clamp-2">{character.description}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => setShowReveal((prev) => !prev)}
        className="ds-button ds-button--ghost absolute right-3 top-3"
      >
        Reveal
      </button>
      {showReveal ? (
        <>
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute inset-0 opacity-80"
              style={{
                background: "linear-gradient(135deg, var(--bg1), var(--bg2), var(--bg3))",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.7 }}
            />
            <div
              className="absolute inset-0 mix-blend-screen"
              style={{
                background: vfxPalette[character.theme.vfx].haze,
                opacity: 0.6,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 20% 20%, var(--c1), transparent 55%), radial-gradient(circle at 80% 80%, var(--c2), transparent 55%)`,
                opacity: 0.5,
                animation: reduceMotion ? undefined : `glowPulse ${motionProfile.pulseDuration}s ease-in-out infinite alternate`,
              }}
            />
            <div className="absolute inset-0 mix-blend-screen">
              {particles.map((particle) => (
                <span
                  key={particle.id}
                  className="absolute rounded-full"
                  style={{
                    top: particle.top,
                    left: particle.left,
                    width: particle.size,
                    height: particle.size,
                    opacity: particle.opacity,
                    background: `radial-gradient(circle, ${vfxPalette[character.theme.vfx].color}, transparent 70%)`,
                    boxShadow: `0 0 16px ${vfxPalette[character.theme.vfx].accent}`,
                    filter: `blur(${particle.blur}px)`,
                    animation: reduceMotion
                      ? undefined
                      : `particleDrift ${particle.duration}s linear ${particle.delay}s infinite, particleFlicker ${particle.duration * 0.6}s ease-in-out ${particle.delay}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
          <motion.div
            className="absolute inset-0 hidden flex-col justify-between gap-4 bg-slate-950/65 p-4 sm:flex"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", ...motionProfile.spring }}
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">{powerTitle}</p>
                <h4 className="text-lg font-semibold text-white">{powerName}</h4>
              </div>
              <ul className="space-y-2 text-sm text-white/80">
                {character.powerReveal.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                {character.forms.map((form, index) => {
                  const open = expandedForm === index
                  return (
                    <div key={form.title} className="rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setExpandedForm(open ? null : index)}
                        className="flex w-full items-center justify-between gap-4 px-3 py-2 text-left text-xs uppercase tracking-[0.25em] text-white/70"
                      >
                        <span>{form.title}</span>
                        <span className="text-[10px] text-white/50">
                          {form.difficulty ?? "basic"}
                        </span>
                      </button>
                      {open ? (
                        <div className="px-3 pb-3 text-sm text-white/70">
                          {form.description}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
            <button type="button" onClick={() => setShowReveal(false)} className="ds-button ds-button--ghost self-end">
              Close
            </button>
          </motion.div>
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 flex sm:hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", ...motionProfile.spring }}
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowReveal(false)}
            />
            <div className="relative z-10 w-full overflow-hidden rounded-t-3xl border border-white/10 bg-slate-950/80 px-5 pb-6 pt-5">
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background: "linear-gradient(135deg, var(--bg1), var(--bg2), var(--bg3))",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: vfxPalette[character.theme.vfx].haze,
                  opacity: 0.4,
                }}
              />
              <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">{powerTitle}</p>
                  <h4 className="text-lg font-semibold text-white">{powerName}</h4>
                </div>
                <button type="button" onClick={() => setShowReveal(false)} className="ds-button ds-button--ghost">
                  Close
                </button>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {character.powerReveal.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2">
                {character.forms.map((form, index) => {
                  const open = expandedForm === index
                  return (
                    <div key={form.title} className="rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setExpandedForm(open ? null : index)}
                        className="flex w-full items-center justify-between gap-4 px-3 py-2 text-left text-xs uppercase tracking-[0.25em] text-white/70"
                      >
                        <span>{form.title}</span>
                        <span className="text-[10px] text-white/50">
                          {form.difficulty ?? "basic"}
                        </span>
                      </button>
                      {open ? (
                        <div className="px-3 pb-3 text-sm text-white/70">
                          {form.description}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </motion.div>
  )
}
