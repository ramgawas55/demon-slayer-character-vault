"use client"

const filters = ["All", "Corps", "Hashira", "Demons", "Upper Moons", "Lower Moons"]

type FiltersProps = {
  value: string
  onChange: (value: string) => void
}

export default function Filters({ value, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const active = value === filter
        return (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            data-active={active}
            className="ds-button"
          >
            {filter}
          </button>
        )
      })}
    </div>
  )
}
