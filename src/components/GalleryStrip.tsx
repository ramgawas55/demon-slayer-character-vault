"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

type GalleryStripProps = {
  images: string[]
}

export default function GalleryStrip({ images }: GalleryStripProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-4">
      {images.map((image, index) => (
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
          />
        </motion.div>
      ))}
    </div>
  )
}
