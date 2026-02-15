"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useState, type CSSProperties } from "react"
import type { Environment } from "../data/characters"

type Particle = {
  id: string
  size: number
  left: string
  top: string
  duration: number
  delay: number
  opacity: number
  blur: number
}

const seeded = (seed: number) => {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

const seedFromString = (value: string) =>
  value.split("").reduce((total, char) => total + char.charCodeAt(0), 0)

const createParticles = (count: number, seedValue: number): Particle[] => {
  const rand = seeded(seedValue)
  return Array.from({ length: count }, (_, index) => {
    const size = 6 + rand() * 16
    return {
      id: `env-particle-${seedValue}-${index}`,
      size,
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      duration: 18 + rand() * 28,
      delay: rand() * 6,
      opacity: 0.2 + rand() * 0.5,
      blur: 2 + rand() * 10,
    }
  })
}

const particleCount: Record<Environment["type"], number> = {
  flame: 24,
  water: 14,
  mist: 12,
  lightning: 10,
  shadow: 16,
  ice: 14,
  blood: 18,
}

type EnvironmentEngineProps = {
  environment: Environment
}

export default function EnvironmentEngine({ environment }: EnvironmentEngineProps) {
  const reduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const update = () => setPaused(document.hidden)
    update()
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])

  const seed = seedFromString(`${environment.type}-${environment.primary}-${environment.secondary}`)
  const particles = useMemo(
    () => createParticles(particleCount[environment.type], seed),
    [environment.type, seed]
  )

  const isPaused = Boolean(paused || reduceMotion)
  const style = {
    "--env-primary": environment.primary,
    "--env-secondary": environment.secondary,
    "--env-glow": environment.glow,
  } as CSSProperties

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${environment.type}-${environment.primary}-${environment.secondary}`}
        className="env-engine"
        data-type={environment.type}
        data-paused={isPaused ? "true" : "false"}
        style={style}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1 }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <div className="env-engine__base" />
        <div className="env-engine__aura" />
        <div className="env-engine__distort" />
        <div className="env-engine__mist" />
        <div className="env-engine__rays" />
        <div className="env-engine__vignette" />
        <div className="env-engine__particles">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="env-engine__particle"
              style={{
                width: particle.size,
                height: particle.size,
                left: particle.left,
                top: particle.top,
                opacity: particle.opacity,
                filter: `blur(${particle.blur}px)`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
