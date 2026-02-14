"use client"

import Image from "next/image"
import { motion } from "framer-motion"

type GalleryStripProps = {
  images: string[]
  glow: string
}

export default function GalleryStrip({ images, glow }: GalleryStripProps) {
  return (
    <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-4">
      {images.map((image, index) => (
        <motion.div
          key={`${image}-${index}`}
          whileHover={{ y: -4 }}
          className="ds-card relative h-40 w-64 flex-shrink-0 overflow-hidden rounded-2xl"
          style={{ boxShadow: `0 14px 30px ${glow}30` }}
        >
          <Image
            src={image}
            alt="Gallery image"
            fill
            className="object-cover object-center"
            sizes="256px"
            quality={85}
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  )
}
