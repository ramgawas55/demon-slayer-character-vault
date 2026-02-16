import { characters, type Character } from "../data/characters"

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const normalizeSlug = (value: string) => safeDecode(value).toLowerCase().trim()

export const getCharacterBySlug = (slug: string): Character | undefined => {
  const normalized = normalizeSlug(slug)
  if (!normalized) {
    return undefined
  }
  return characters.find((character) => normalizeSlug(character.slug) === normalized)
}
