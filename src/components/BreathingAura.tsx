"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { EnvironmentType } from "../data/characters"

type BreathingAuraProps = {
  active: boolean
  type: EnvironmentType
  primary: string
  secondary: string
}

const auraPositions: Record<EnvironmentType, { a: string; b: string }> = {
  flame: { a: "22% 20%", b: "78% 70%" },
  water: { a: "30% 25%", b: "70% 75%" },
  mist: { a: "25% 35%", b: "75% 65%" },
  lightning: { a: "18% 25%", b: "82% 68%" },
  shadow: { a: "28% 30%", b: "72% 60%" },
  ice: { a: "24% 22%", b: "76% 72%" },
  blood: { a: "20% 28%", b: "80% 70%" },
}

export default function BreathingAura({ active, type, primary, secondary }: BreathingAuraProps) {
  const reduceMotion = useReducedMotion()
  const positions = auraPositions[type]
  const backgroundImage = `radial-gradient(circle at ${positions.a}, ${primary}66, transparent 62%), radial-gradient(circle at ${positions.b}, ${secondary}55, transparent 68%)`

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="breathing-aura"
          style={{ backgroundImage }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={
            reduceMotion
              ? { opacity: 0.35, scale: 1 }
              : { opacity: [0, 0.45, 0.35], scale: [0.94, 1.08, 1] }
          }
          exit={{ opacity: 0, scale: 0.98 }}
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : { duration: 1.7, ease: "easeInOut", times: [0, 0.55, 1] }
          }
        />
      ) : null}
    </AnimatePresence>
  )
}
