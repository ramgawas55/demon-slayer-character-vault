"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { type CSSProperties } from "react"
import type { Environment } from "../data/characters"

type EnvironmentEngineProps = {
  environment: Environment
}

export default function EnvironmentEngine({ environment }: EnvironmentEngineProps) {
  const reduceMotion = useReducedMotion()
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
        style={style}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1 }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
        aria-hidden="true"
      >
        <div className="env-engine__base" />
        <div className="env-engine__glow" />
        <div className="env-engine__vignette" />
      </motion.div>
    </AnimatePresence>
  )
}
