"use client"

const factionFilters = ["All", "Corps", "Hashira", "Demons"]
const rankFilters = ["All", "Upper Moons", "Lower Moons", "Hashira", "Corps"]
const techniqueFilters = ["All", "Breathing", "Blood Demon Art"]
const sortOptions = ["Popularity", "Name", "Rank"]

type FiltersProps = {
  faction: string
  rank: string
  technique: string
  sort: string
  tags: string[]
  selectedTags: string[]
  onFactionChange: (value: string) => void
  onRankChange: (value: string) => void
  onTechniqueChange: (value: string) => void
  onSortChange: (value: string) => void
  onTagChange: (value: string[]) => void
}

export default function Filters({
  faction,
  rank,
  technique,
  sort,
  tags,
  selectedTags,
  onFactionChange,
  onRankChange,
  onTechniqueChange,
  onSortChange,
  onTagChange,
}: FiltersProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter((item) => item !== tag))
      return
    }
    onTagChange([...selectedTags, tag])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Faction</p>
        <div className="flex flex-wrap gap-2">
          {factionFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFactionChange(filter)}
              data-active={faction === filter}
              aria-pressed={faction === filter}
              className="ds-chip"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Rank</p>
        <div className="flex flex-wrap gap-2">
          {rankFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onRankChange(filter)}
              data-active={rank === filter}
              aria-pressed={rank === filter}
              className="ds-chip"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Technique</p>
        <div className="flex flex-wrap gap-2">
          {techniqueFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onTechniqueChange(filter)}
              data-active={technique === filter}
              aria-pressed={technique === filter}
              className="ds-chip"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Tags</p>
          {selectedTags.length > 0 ? (
            <button
              type="button"
              onClick={() => onTagChange([])}
              className="ds-chip text-[10px] tracking-[0.2em]"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              data-active={selectedTags.includes(tag)}
              aria-pressed={selectedTags.includes(tag)}
              className="ds-chip text-[10px] tracking-[0.2em]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Sort</p>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSortChange(option)}
              data-active={sort === option}
              aria-pressed={sort === option}
              className="ds-chip"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
