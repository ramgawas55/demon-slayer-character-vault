"use client"

export default function GlobalBackground() {
  return (
    <div className="ds-bg" aria-hidden="true">
      <div className="ds-bg__gradient" />
      <div className="ds-bg__pattern" />
      <div className="ds-bg__glow ds-bg__glow--one" />
      <div className="ds-bg__glow ds-bg__glow--two" />
      <div className="ds-bg__noise" />
    </div>
  )
}
