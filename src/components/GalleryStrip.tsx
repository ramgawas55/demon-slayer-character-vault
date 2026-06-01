"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

type GalleryStripProps = {
  images: string[]
}

export default function GalleryStrip({ images }: GalleryStripProps) {
  const reduceMotion = useReducedMotion()
  const [sources, setSources] = useState(images)
  const placeholderSrc = "/characters/placeholder.webp"

  useEffect(() => {
    setSources(images)
  }, [images])

  const resolveFallback = (src: string) => {
    if (src.endsWith(".webp")) {
      return src.replace(".webp", ".jpg")
    }
    if (!src.includes("placeholder")) {
      return placeholderSrc
    }
    return placeholderSrc
  }

  return (
    <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-4">
      {sources.map((image, index) => (
        <motion.div
          key={`${image}-${index}`}
          whileHover={reduceMotion ? undefined : { y: -2 }}
          className="ds-card relative h-40 w-64 flex-shrink-0 overflow-hidden rounded-2xl"
        >
          <Image
            src={image}
            alt="Gallery image"
            fill
            className="object-cover object-center"
            sizes="256px"
            quality={92}
            loading="lazy"
            onError={() =>
              setSources((prev) => {
                const next = [...prev]
                next[index] = resolveFallback(next[index] ?? "")
                return next
              })
            }
          />
        </motion.div>
      ))}
    </div>
  )
}
