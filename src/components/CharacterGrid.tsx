"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Character } from "../data/characters"
import CharacterCard from "./CharacterCard"

type CharacterGridProps = {
  characters: Character[]
}

export default function CharacterGrid({ characters }: CharacterGridProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4 }}
    >
      {characters.map((character) => (
        <CharacterCard key={character.slug} character={character} />
      ))}
    </motion.div>
  )
}
