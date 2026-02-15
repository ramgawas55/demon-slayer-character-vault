"use client"

import { useEffect, useMemo, useState } from "react"
import { useReducedMotion } from "framer-motion"

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

const createParticles = (count: number, seedValue: number): Particle[] => {
  const rand = seeded(seedValue)
  return Array.from({ length: count }, (_, index) => {
    const size = 6 + rand() * 18
    return {
      id: `cloud-particle-${seedValue}-${index}`,
      size,
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      duration: 40 + rand() * 25,
      delay: rand() * 6,
      opacity: 0.18 + rand() * 0.3,
      blur: 4 + rand() * 10,
    }
  })
}

export default function CinematicCloudBackground() {
  const reduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const update = () => setPaused(document.hidden)
    update()
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])

  const particles = useMemo(() => createParticles(32, 7), [])
  const isPaused = Boolean(paused || reduceMotion)

  return (
    <div className="cinematic-clouds" data-paused={isPaused ? "true" : "false"} aria-hidden="true">
      <div className="cinematic-clouds__base" />
      <div className="cinematic-clouds__glow" />
      <div className="cinematic-clouds__mist" />
      <div className="cinematic-clouds__vignette" />
      <div className="cinematic-clouds__particles">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="cinematic-clouds__particle"
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
    </div>
  )
}
