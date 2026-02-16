"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { Character } from "../data/characters"
import { useTheme } from "../context/ThemeContext"
import TiltCard from "./TiltCard"
import GalleryStrip from "./GalleryStrip"

type CharacterDetailProps = {
  character: Character
  prev?: Character
  next?: Character
}

export default function CharacterDetail({ character, prev, next }: CharacterDetailProps) {
  const [images, setImages] = useState(character.images)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "techniques" | "stats" | "trivia">("overview")
  const [expandedTechnique, setExpandedTechnique] = useState<number | null>(0)
  const { setTheme } = useTheme()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    setTheme(character.uniformTheme)
  }, [character.uniformTheme, setTheme])

  useEffect(() => {
    let active = true
    setIsLoading(true)
    const load = async () => {
      try {
        const response = await fetch(`/api/overrides?slug=${character.slug}`)
        if (!response.ok) {
          return
        }
        const payload = (await response.json()) as { images?: Character["images"] }
        if (active && payload.images) {
          setImages(payload.images)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [character.slug])

  return (
    <motion.main
      className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-6 pb-24 pt-12 md:pt-16 lg:pt-24"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      aria-busy={isLoading}
    >
      <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-7">
          <Link href="/" className="ds-button ds-button--ghost">
            Back
          </Link>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">{character.faction}</p>
            <h1 className="text-6xl font-semibold tracking-[0.08em] text-white sm:text-6xl lg:text-7xl">
              {character.name}
            </h1>
            {character.rank ? (
              <p className="text-sm uppercase tracking-[0.28em] text-white/60">
                {character.rank}
              </p>
            ) : null}
          </div>
          <p className="max-w-xl text-base text-white/75 leading-7">{character.description}</p>
        </div>
        <div className="flex-1">
          <TiltCard
            image={images.posterUrl}
            title={character.name}
            layoutId={`card-${character.slug}`}
            imageLayoutId={`poster-${character.slug}`}
            className="mx-auto max-w-sm"
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {[
            { id: "overview", label: "Overview" },
            { id: "techniques", label: "Techniques" },
            { id: "stats", label: "Stats" },
            { id: "trivia", label: "Trivia" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="ds-chip"
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "overview" ? (
          <div className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Full Name</p>
              <p className="text-lg text-white">{character.fullName}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Affiliation</p>
              <div className="flex flex-wrap gap-2">
                {character.affiliation.map((item) => (
                  <span key={item} className="ds-chip text-[10px] tracking-[0.2em] text-white/70">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Status</p>
                  <p className="text-lg text-white">{character.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">First Appearance</p>
                  <p className="text-lg text-white">{character.firstAppearance}</p>
                </div>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Quote</p>
              <p className="text-base italic text-white/80">
                {character.quote ? `“${character.quote}”` : "—"}
              </p>
            </div>
          </div>
        ) : null}
        {activeTab === "techniques" ? (
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {character.technique.type === "breathing" ? "Breathing Style" : "Blood Demon Art"}
                </p>
                <p className="text-xl font-semibold text-white">{character.technique.name}</p>
              </div>
              {character.technique.type === "breathing" && character.technique.nichirinColor ? (
                <span className="ds-chip" style={{ borderColor: character.technique.nichirinColor }}>
                  Nichirin
                </span>
              ) : null}
            </div>
            <div className="space-y-2">
              {(character.technique.type === "breathing"
                ? character.technique.forms.map((form) => ({
                    title: form.title,
                    description: form.description,
                    meta: form.bestUse ?? "Technique",
                  }))
                : character.technique.abilities.map((ability) => ({
                    title: ability,
                    description: ability,
                    meta: "Ability",
                  }))
              ).map((entry, index) => {
                const open = expandedTechnique === index
                return (
                  <div key={entry.title} className="rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setExpandedTechnique(open ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-xs uppercase tracking-[0.25em] text-white/70"
                    >
                      <span>{entry.title}</span>
                      <span className="text-[10px] text-white/50">{entry.meta}</span>
                    </button>
                    {open ? (
                      <div className="px-4 pb-4 text-sm text-white/70">
                        {entry.description}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
        {activeTab === "stats" ? (
          <div className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-[220px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Threat Level</p>
              <p className="mt-2 text-4xl font-semibold text-white">{character.threatLevel}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">out of 5</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {character.tags.map((tag) => (
                  <span key={tag} className="ds-chip text-[10px] tracking-[0.2em] text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {activeTab === "trivia" ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ul className="space-y-3 text-sm text-white/75">
              {(character.trivia ?? []).slice(0, 6).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="space-y-5">
        <h2 className="text-sm uppercase tracking-[0.32em] text-white/60">Film Wall</h2>
        {isLoading ? (
          <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-4">
            {[0, 1, 2].map((item) => (
              <div
                key={`gallery-skeleton-${item}`}
                className="ds-card h-40 w-64 flex-shrink-0 animate-pulse bg-white/5"
              />
            ))}
          </div>
        ) : (
          <GalleryStrip images={images.galleryUrls} />
        )}
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
