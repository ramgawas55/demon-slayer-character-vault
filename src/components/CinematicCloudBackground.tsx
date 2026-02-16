"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

export default function CinematicCloudBackground() {
  const reduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const update = () => setPaused(document.hidden)
    update()
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])

  const isPaused = Boolean(paused || reduceMotion)

  return (
    <div className="cinematic-clouds" data-paused={isPaused ? "true" : "false"} aria-hidden="true">
      <div className="cinematic-clouds__base" />
      <div className="cinematic-clouds__mist" />
      <div className="cinematic-clouds__noise" />
      <div className="cinematic-clouds__vignette" />
    </div>
  )
}
