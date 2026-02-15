import { Metadata } from "next"
import { notFound } from "next/navigation"
import CharacterDetail from "../../../components/CharacterDetail"
import EnvironmentEngine from "../../../components/EnvironmentEngine"
import { characters } from "../../../data/characters"

type CharacterPageProps = {
  params: { slug: string }
}

export function generateMetadata({ params }: CharacterPageProps): Metadata {
  const character = characters.find((item) => item.slug === params.slug)
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

export default function CharacterPage({ params }: CharacterPageProps) {
  const index = characters.findIndex((item) => item.slug === params.slug)
  if (index === -1) {
    notFound()
  }
  const character = characters[index]
  const prev = index > 0 ? characters[index - 1] : undefined
  const next = index < characters.length - 1 ? characters[index + 1] : undefined

  return (
    <div className="relative min-h-screen">
      <EnvironmentEngine environment={character.environment} />
      <CharacterDetail character={character} prev={prev} next={next} />
    </div>
  )
}
