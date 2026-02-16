import { Metadata } from "next"
import { notFound } from "next/navigation"
import CharacterDetail from "../../../components/CharacterDetail"
import EnvironmentEngine from "../../../components/EnvironmentEngine"
import { characters } from "../../../data/characters"
import { getCharacterBySlug } from "../../../lib/getCharacter"

type CharacterPageProps = {
  params: { slug: string }
}

export function generateMetadata({ params }: CharacterPageProps): Metadata {
  const character = getCharacterBySlug(params.slug)
  if (!character) {
    return {
      title: "Character Not Found",
    }
  }
  return {
    title: `${character.name} | Demon Slayer Character Vault`,
    description: character.description,
  }
}

export const dynamicParams = false

export function generateStaticParams() {
  return characters.map((character) => ({ slug: character.slug }))
}

export default function Page({ params }: { params: { slug: string } }) {
  const character = getCharacterBySlug(params.slug)
  if (!character) {
    notFound()
  }
  const index = characters.findIndex((item) => item.slug === character.slug)
  const prev = index > 0 ? characters[index - 1] : undefined
  const next = index < characters.length - 1 ? characters[index + 1] : undefined
  const showDebug = process.env.NODE_ENV !== "production"

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <EnvironmentEngine environment={character.environment} />
      </div>
      <div className="relative z-10">
        {showDebug ? (
          <div className="mx-auto w-full max-w-7xl px-6 pt-6">
            <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/70">
              <div>Slug: {params.slug}</div>
              <div>Character found: {character ? "yes" : "no"}</div>
              <div>Characters in dataset: {characters.length}</div>
            </div>
          </div>
        ) : null}
        <CharacterDetail character={character} prev={prev} next={next} />
      </div>
    </div>
  )
}
