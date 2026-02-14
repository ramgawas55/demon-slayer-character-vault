"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Character } from "../data/characters"
import TiltCard from "./TiltCard"
import GalleryStrip from "./GalleryStrip"

type CharacterDetailProps = {
  character: Character
  prev?: Character
  next?: Character
}

export default function CharacterDetail({ character, prev, next }: CharacterDetailProps) {
  const [images, setImages] = useState(character.images)

  useEffect(() => {
    let active = true
    const load = async () => {
      const response = await fetch(`/api/overrides?slug=${character.slug}`)
      if (!response.ok) {
        return
      }
      const payload = (await response.json()) as { images?: Character["images"] }
      if (active && payload.images) {
        setImages(payload.images)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [character.slug])

  return (
    <motion.main
      className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 pb-24 pt-20"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <Link href="/" className="ds-button ds-button--ghost">
            Back
          </Link>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.45em] text-white/50">{character.faction}</p>
            <h1 className="text-4xl font-semibold uppercase tracking-[0.2em] text-white sm:text-6xl lg:text-7xl">
              {character.name}
            </h1>
            {character.rank ? (
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                {character.rank}
              </p>
            ) : null}
          </div>
          <p className="max-w-xl text-base text-white/75">{character.description}</p>
          <div className="flex flex-wrap gap-3">
            {character.tags.map((tag) => (
              <span key={tag} className="ds-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <TiltCard
            image={images.posterUrl}
            title={character.name}
            glow={{
              primary: character.theme.primaryGlow,
              secondary: character.theme.secondaryGlow,
            }}
            className="mx-auto max-w-sm"
          />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-sm uppercase tracking-[0.35em] text-white/60">Film Wall</h2>
        <GalleryStrip images={images.galleryUrls} glow={character.theme.primaryGlow} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {prev ? (
          <Link href={`/characters/${prev.slug}`} className="ds-button">
            Prev
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/characters/${next.slug}`} className="ds-button">
            Next
          </Link>
        ) : (
          <span />
        )}
      </div>
    </motion.main>
  )
}
