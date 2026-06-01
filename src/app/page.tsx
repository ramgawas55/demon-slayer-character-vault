"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
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
    <main className="min-h-screen w-full px-4 py-6 sm:px-6 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">Character Vault</h1>
            <p className="text-sm sm:text-base text-white/60">Explore the world of Demon Slayer: Kimetsu no Yaiba.</p>
          </div>
          <Link href="/upload" className="ds-button !w-full sm:!w-auto bg-primary/10 hover:bg-primary/20 border-primary/30 group">
            <span className="flex items-center gap-2">
              <span className="text-primary group-hover:scale-110 transition-transform">✦</span>
              Upload New Asset
            </span>
          </Link>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
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
          </aside>

          <div className="flex-1">
            <CharacterGrid characters={filtered} />
          </div>
        </div>
      </div>
    </main>
  )
}
