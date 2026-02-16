"use client"

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

type TiltCardProps = {
  image: string
  title: string
  className?: string
  layoutId?: string
  imageLayoutId?: string
}

export default function TiltCard({ image, title, className, layoutId, imageLayoutId }: TiltCardProps) {
  const reduceMotion = useReducedMotion()
  const [isTouch, setIsTouch] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-50, 50], [8, -8])
  const rotateY = useTransform(x, [-50, 50], [-8, 8])
  const springX = useSpring(rotateX, { stiffness: 140, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 140, damping: 22 })
  const depth = useTransform(y, [-50, 50], [12, 6])

  useEffect(() => {
    const matcher = window.matchMedia("(hover: none), (pointer: coarse)")
    const update = () => setIsTouch(matcher.matches || navigator.maxTouchPoints > 0)
    update()
    matcher.addEventListener("change", update)
    return () => matcher.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const update = () => setIsCompact(window.innerWidth < 900)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const isInteractive = !reduceMotion && !isTouch && !isCompact

  return (
    <motion.div
      layoutId={layoutId}
      className={`ds-card relative rounded-3xl p-3 ${isInteractive ? "card-tilt" : ""} ${className ?? ""}`}
      style={{
        rotateX: isInteractive ? springX : 0,
        rotateY: isInteractive ? springY : 0,
      }}
      onPointerMove={(event) => {
        if (!isInteractive) {
          return
        }
        const bounds = event.currentTarget.getBoundingClientRect()
        const offsetX = event.clientX - bounds.left - bounds.width / 2
        const offsetY = event.clientY - bounds.top - bounds.height / 2
        x.set(offsetX)
        y.set(offsetY)
      }}
      onPointerLeave={() => {
        if (!isInteractive) {
          return
        }
        x.set(0)
        y.set(0)
      }}
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-40"
        style={{
          background:
            "linear-gradient(140deg, color-mix(in srgb, var(--primary) 45%, transparent), transparent, color-mix(in srgb, var(--secondary) 35%, transparent))",
        }}
      />
      <motion.div
        layoutId={imageLayoutId}
        className="relative overflow-hidden rounded-2xl"
        style={{ translateZ: isInteractive ? depth : 0 }}
      >
        <Image
          src={image}
          alt={`${title} poster`}
          width={420}
          height={560}
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 42vw, 420px"
          className="w-full h-auto object-cover object-center"
          quality={92}
          priority
        />
      </motion.div>
    </motion.div>
  )
}
