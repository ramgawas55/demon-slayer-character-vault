"use client"

import { useEffect, useMemo, useState } from "react"
import CharacterGrid from "../components/CharacterGrid"
import Filters from "../components/Filters"
import SearchBar from "../components/SearchBar"
import { Character, characters } from "../data/characters"
import { motion, useReducedMotion } from "framer-motion"

const rankWeight = (rank: Character["rank"]) => {
  if (rank.startsWith("Upper Moon")) {
    const value = Number(rank.replace("Upper Moon ", ""))
    return Number.isNaN(value) ? 8 : value
  }
  if (rank.startsWith("Lower Moon")) {
    const value = Number(rank.replace("Lower Moon ", ""))
    return Number.isNaN(value) ? 16 : 10 + value
  }
  if (rank === "Hashira") {
    return 30
  }
  if (rank === "Corps") {
    return 40
  }
  return 50
}

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [factionFilter, setFactionFilter] = useState("All")
  const [rankFilter, setRankFilter] = useState("All")
  const [techniqueFilter, setTechniqueFilter] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState("Popularity")
  const [overrides, setOverrides] = useState<Record<string, Character["images"]>>({})
  const reduceMotion = useReducedMotion()
  const tagOptions = useMemo(() => {
    const unique = new Set<string>()
    characters.forEach((character) => {
      character.tags.forEach((tag) => unique.add(tag))
    })
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [])

  useEffect(() => {
    let active = true
    const loadOverrides = async () => {
      const response = await fetch("/api/overrides")
      if (!response.ok) {
        return
      }
      const payload = (await response.json()) as { overrides?: Record<string, Character["images"]> }
      if (active && payload.overrides) {
        setOverrides(payload.overrides)
      }
    }
    loadOverrides()
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const popularityScore = new Map(
      characters.map((character, index) => [character.slug, characters.length - index])
    )
    return characters
      .map((character) => ({
        ...character,
        images: overrides[character.slug] ?? character.images,
      }))
      .filter((character) => {
        const matchesFaction =
          factionFilter === "All" ||
          (factionFilter === "Corps" && character.faction === "corps") ||
          (factionFilter === "Hashira" && character.faction === "hashira") ||
          (factionFilter === "Demons" && character.faction === "demon")
        const matchesRank =
          rankFilter === "All" ||
          (rankFilter === "Upper Moons" && character.rank.toLowerCase().includes("upper moon")) ||
          (rankFilter === "Lower Moons" && character.rank.toLowerCase().includes("lower moon")) ||
          (rankFilter === "Hashira" && character.rank === "Hashira") ||
          (rankFilter === "Corps" && character.rank === "Corps")
        const matchesTechnique =
          techniqueFilter === "All" ||
          (techniqueFilter === "Breathing" && character.technique.type === "breathing") ||
          (techniqueFilter === "Blood Demon Art" && character.technique.type === "blood_demon_art")
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.some((tag) => character.tags.includes(tag))
        const matchesQuery = character.name.toLowerCase().includes(query.toLowerCase())
        return matchesFaction && matchesRank && matchesTechnique && matchesTags && matchesQuery
      })
      .sort((a, b) => {
        if (sort === "Name") {
          const nameOrder = a.name.localeCompare(b.name)
          return nameOrder !== 0 ? nameOrder : (popularityScore.get(b.slug) ?? 0) - (popularityScore.get(a.slug) ?? 0)
        }
        if (sort === "Rank") {
          const rankOrder = rankWeight(a.rank) - rankWeight(b.rank)
          return rankOrder !== 0 ? rankOrder : a.name.localeCompare(b.name)
        }
        const popularityOrder = (popularityScore.get(b.slug) ?? 0) - (popularityScore.get(a.slug) ?? 0)
        return popularityOrder !== 0 ? popularityOrder : a.name.localeCompare(b.name)
      })
  }, [query, factionFilter, rankFilter, techniqueFilter, selectedTags, sort, overrides])

  return (
    <div className="relative min-h-screen">
      <main className="mx-auto flex max-w-7xl flex-col px-6 pb-24 pt-12 md:pt-16 lg:pt-24">
        <motion.section
          className="space-y-6"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Cinematic Character Index
          </p>
          <h1 className="text-6xl font-semibold tracking-[0.08em] text-white sm:text-6xl lg:text-7xl">
            Demon Slayer Character Vault
          </h1>
          <p className="max-w-2xl text-base text-white/70 leading-7">
            Explore the Corps, the Hashira, and the Upper Moons through a cinematic character
            vault built for clarity and speed.
          </p>
        </motion.section>
        <div className="flex flex-col gap-10 pt-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <SearchBar value={query} onChange={setQuery} />
            <Filters
              faction={factionFilter}
              rank={rankFilter}
              technique={techniqueFilter}
              sort={sort}
              tags={tagOptions}
              selectedTags={selectedTags}
              onFactionChange={setFactionFilter}
              onRankChange={setRankFilter}
              onTechniqueChange={setTechniqueFilter}
              onSortChange={setSort}
              onTagChange={setSelectedTags}
            />
          </div>
          <CharacterGrid characters={filtered} />
        </div>
      </main>
    </div>
  )
}
