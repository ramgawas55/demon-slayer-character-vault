"use client"

import { Fragment } from "react"
import { motion } from "framer-motion"
import { Character } from "../data/characters"
import CharacterCard from "./CharacterCard"

type CharacterGridProps = {
  characters: Character[]
}

export default function CharacterGrid({ characters }: CharacterGridProps) {
  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {characters.map((character) => (
        <Fragment key={character.slug}>
          <CharacterCard character={character} />
        </Fragment>
      ))}
    </motion.div>
  )
}
