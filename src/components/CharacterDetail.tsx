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
      className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-12 sm:gap-16 px-4 sm:px-6 pb-24 pt-8 sm:pt-12 md:pt-16 lg:pt-24"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      aria-busy={isLoading}
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6 sm:space-y-7 order-2 lg:order-1">
          <Link href="/" className="ds-button ds-button--ghost !w-fit !py-2 !px-4 !text-[10px]">
            Back to Vault
          </Link>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/50">{character.faction}</p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-none">
              {character.name}
            </h1>
            {character.rank ? (
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.28em] text-white/60">
                {character.rank}
              </p>
            ) : null}
          </div>
          <p className="max-w-xl text-sm sm:text-base text-white/75 leading-relaxed sm:leading-7">{character.description}</p>
        </div>
        <div className="flex-1 order-1 lg:order-2">
          <TiltCard
            image={images.posterUrl}
            title={character.name}
            layoutId={`card-${character.slug}`}
            imageLayoutId={`poster-${character.slug}`}
            className="mx-auto max-w-[280px] sm:max-w-sm"
          />
        </div>
      </div>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
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
              className="ds-chip !py-2 !px-4 sm:!py-1.5 sm:!px-3 !text-[10px]"
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" ? (
              <div className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Full Name</p>
                    <p className="text-base sm:text-lg text-white font-medium">{character.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Affiliation</p>
                    <div className="flex flex-wrap gap-2">
                      {character.affiliation.map((item) => (
                        <span key={item} className="ds-chip !py-1 !px-2.5 !text-[9px] tracking-wider text-white/70">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Status</p>
                      <p className="text-base sm:text-lg text-white font-medium">{character.status}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">First Appearance</p>
                      <p className="text-base sm:text-lg text-white font-medium">{character.firstAppearance}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Quote</p>
                    <p className="text-sm sm:text-base italic text-white/80 border-l-2 border-primary/30 pl-4 py-1">
                      {character.quote ? `“${character.quote}”` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            
            {activeTab === "techniques" ? (
              <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                      {character.technique.type === "breathing" ? "Breathing Style" : "Blood Demon Art"}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-white tracking-tight">{character.technique.name}</p>
                  </div>
                  {character.technique.type === "breathing" && character.technique.nichirinColor ? (
                    <span className="ds-chip !py-1 !px-3 !text-[9px] !border-current" style={{ color: character.technique.nichirinColor }}>
                      Nichirin Blade
                    </span>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:gap-4">
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
                      <div key={entry.title} className={cn(
                        "rounded-xl border border-white/5 bg-white/[0.02] transition-colors",
                        open && "border-white/10 bg-white/[0.04]"
                      )}>
                        <button
                          type="button"
                          onClick={() => setExpandedTechnique(open ? null : index)}
                          className="flex w-full items-center justify-between gap-4 px-4 sm:px-6 py-4 text-left"
                        >
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white/80">{entry.title}</span>
                          <span className="text-[9px] uppercase tracking-widest text-white/30 hidden sm:block">{entry.meta}</span>
                        </button>
                        {open ? (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="px-4 sm:px-6 pb-5 text-xs sm:text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4"
                          >
                            {entry.description}
                          </motion.div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
            
            {activeTab === "stats" ? (
              <div className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-8 md:grid-cols-[200px_1fr]">
                <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Threat Level</p>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <p className="text-5xl font-black text-white leading-none">{character.threatLevel}</p>
                    <p className="text-xs uppercase tracking-widest text-white/20">/ 5</p>
                  </div>
                  <div className="mt-4 flex justify-center md:justify-start gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1.5 w-6 rounded-full transition-colors",
                          i <= character.threatLevel ? "bg-primary" : "bg-white/10"
                        )} 
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Traits & Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {character.tags.map((tag) => (
                      <span key={tag} className="ds-chip !py-1.5 !px-3.5 !text-[10px] tracking-wider text-white/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "trivia" ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-8">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-6">Character Trivia</p>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {character.trivia.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-lg bg-primary/20 text-primary text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm text-white/70 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 sm:mt-20">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8 text-center sm:text-left">Gallery Highlights</p>
        <GalleryStrip slug={character.slug} />
      </div>

      <div className="mt-16 sm:mt-24 flex items-center justify-between border-t border-white/10 pt-8">
        {prev ? (
          <Link 
            href={`/characters/${prev.slug}`} 
            className="group flex flex-col items-start gap-1"
            onClick={() => setTheme(prev.uniformTheme)}
          >
            <span className="text-[9px] uppercase tracking-widest text-white/30">Previous</span>
            <span className="text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors">← {prev.name}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link 
            href={`/characters/${next.slug}`} 
            className="group flex flex-col items-end gap-1 text-right"
            onClick={() => setTheme(next.uniformTheme)}
          >
            <span className="text-[9px] uppercase tracking-widest text-white/30">Next</span>
            <span className="text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors">{next.name} →</span>
          </Link>
        ) : <div />}
      </div>
    </motion.main>
  )
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
