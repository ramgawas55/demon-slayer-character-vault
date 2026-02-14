"use client"

import { useEffect, useMemo, useState } from "react"
import CharacterGrid from "../components/CharacterGrid"
import Filters from "../components/Filters"
import SearchBar from "../components/SearchBar"
import { Character, characters } from "../data/characters"
import { motion } from "framer-motion"

const filterMap: Record<string, (character: (typeof characters)[number]) => boolean> = {
  All: () => true,
  Corps: (character) => character.faction === "corps",
  Hashira: (character) => character.faction === "hashira",
  Demons: (character) => character.faction === "demon",
  "Upper Moons": (character) => character.rank?.toLowerCase().includes("upper moon") ?? false,
  "Lower Moons": (character) => character.rank?.toLowerCase().includes("lower moon") ?? false,
}

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")
  const [overrides, setOverrides] = useState<Record<string, Character["images"]>>({})

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
    const tester = filterMap[filter] ?? filterMap.All
    return characters
      .map((character) => ({
        ...character,
        images: overrides[character.slug] ?? character.images,
      }))
      .filter((character) => {
      const matchesFilter = tester(character)
      const matchesQuery = character.name.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [query, filter, overrides])

  return (
    <div className="relative min-h-screen">
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-16">
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Demon Slayer Character Vault
          </p>
          <h1 className="hero-breathe text-4xl font-semibold uppercase tracking-[0.15em] text-white sm:text-6xl">
            Demon Slayer Character Vault
          </h1>
          <p className="max-w-2xl text-base text-white/70">
            Explore the Corps, the Hashira, and the Upper Moons through a neon-cinematic
            gallery built for atmosphere and speed.
          </p>
        </motion.section>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <SearchBar value={query} onChange={setQuery} />
          <Filters value={filter} onChange={setFilter} />
        </div>
        <CharacterGrid characters={filtered} />
      </main>
    </div>
  )
}
