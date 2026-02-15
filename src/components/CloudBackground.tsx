"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

export default function CloudBackground() {
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
    <div className="cloud-bg" data-paused={isPaused ? "true" : "false"} aria-hidden="true">
      <div className="cloud-bg__base" />
      <div className="cloud-bg__clouds" />
      <div className="cloud-bg__clouds cloud-bg__clouds--soft" />
      <div className="cloud-bg__vignette" />
      <div className="cloud-bg__grain" />
    </div>
  )
}
