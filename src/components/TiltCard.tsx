"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import { useMemo } from "react"

type TiltCardProps = {
  image: string
  title: string
  glow: {
    primary: string
    secondary: string
  }
  className?: string
}

export default function TiltCard({ image, title, glow, className }: TiltCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-50, 50], [12, -12])
  const rotateY = useTransform(x, [-50, 50], [-12, 12])
  const springX = useSpring(rotateX, { stiffness: 160, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 160, damping: 20 })
  const depth = useTransform(y, [-50, 50], [28, 14])

  const shadow = useMemo(
    () => `0 30px 60px ${glow.primary}30, 0 20px 40px ${glow.secondary}25`,
    [glow.primary, glow.secondary]
  )

  return (
    <motion.div
      className={`card-tilt ds-card relative rounded-3xl p-3 ${className ?? ""}`}
      style={{
        rotateX: springX,
        rotateY: springY,
        boxShadow: shadow,
      }}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const offsetX = event.clientX - bounds.left - bounds.width / 2
        const offsetY = event.clientY - bounds.top - bounds.height / 2
        x.set(offsetX)
        y.set(offsetY)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-70"
        style={{
          background: `linear-gradient(140deg, ${glow.primary}55, transparent, ${glow.secondary}55)`,
        }}
      />
      <motion.div className="relative overflow-hidden rounded-2xl" style={{ translateZ: depth }}>
        <Image
          src={image}
          alt={`${title} poster`}
          width={360}
          height={480}
          sizes="(max-width: 640px) 90vw, 360px"
          className="w-full h-auto object-cover object-center"
          quality={85}
          priority
        />
      </motion.div>
    </motion.div>
  )
}
