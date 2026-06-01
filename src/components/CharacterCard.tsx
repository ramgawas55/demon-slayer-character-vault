"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { Character } from "../data/characters"
import { useTheme } from "../context/ThemeContext"
import BreathingAura from "./BreathingAura"

type CharacterCardProps = {
  character: Character
}

type ThemeVars = {
  "--c1": string
  "--c2": string
  "--bg1": string
  "--bg2": string
  "--bg3": string
  "--card-accent": string
}

const baseThemeVars: ThemeVars = {
  "--c1": "#7c83ff",
  "--c2": "#94a3b8",
  "--bg1": "#0e1116",
  "--bg2": "#0b0f15",
  "--bg3": "#090b10",
  "--card-accent": "#7c83ff",
}

function CharacterCard({ character }: CharacterCardProps) {
  const [showReveal, setShowReveal] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [isPopupHover, setIsPopupHover] = useState(false)
  const [popupStyle, setPopupStyle] = useState<{ left: number; top: number; width: number } | null>(null)
  const [popupReady, setPopupReady] = useState(false)
  const [posterSrc, setPosterSrc] = useState(character.images.posterUrl)
  const placeholderSrc = "/characters/placeholder.webp"
  const reduceMotion = useReducedMotion()
  const { setTheme } = useTheme()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const matcher = window.matchMedia("(hover: none), (pointer: coarse)")
    const update = () => setIsTouch(matcher.matches || navigator.maxTouchPoints > 0)
    update()
    matcher.addEventListener("change", update)
    return () => matcher.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    setPosterSrc(character.images.posterUrl)
  }, [character.images.posterUrl])

  const resolveFallback = useCallback(
    (src: string) => {
      if (src.endsWith(".webp")) {
        return src.replace(".webp", ".jpg")
      }
      if (!src.includes("placeholder")) {
        return placeholderSrc
      }
      return placeholderSrc
    },
    [placeholderSrc]
  )

  useEffect(() => {
    if (!showReveal) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowReveal(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showReveal])

  useEffect(() => {
    if (!showReveal) {
      setIsPopupHover(false)
    }
  }, [showReveal])

  const updatePopupPosition = useCallback(() => {
    const cardEl = cardRef.current
    const popupEl = popupRef.current
    if (!cardEl || !popupEl) {
      return
    }
    const rect = cardEl.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const padding = 12
    const preferredWidth = Math.min(360, viewportWidth - padding * 2)
    const popupHeight = popupEl.getBoundingClientRect().height
    let left = rect.left + rect.width / 2 - preferredWidth / 2
    left = Math.max(padding, Math.min(left, viewportWidth - preferredWidth - padding))
    let top = rect.bottom + 12
    if (top + popupHeight > viewportHeight - padding) {
      top = rect.top - popupHeight - 12
    }
    if (top < padding) {
      top = padding
    }
    setPopupStyle({ left, top, width: preferredWidth })
    setPopupReady(true)
  }, [])

  useLayoutEffect(() => {
    if (!showReveal || isTouch) {
      return
    }
    setPopupReady(false)
    requestAnimationFrame(() => {
      updatePopupPosition()
    })
  }, [showReveal, isTouch, updatePopupPosition])

  useEffect(() => {
    if (!showReveal || isTouch) {
      return
    }
    const handleScroll = () => updatePopupPosition()
    const handleResize = () => updatePopupPosition()
    window.addEventListener("scroll", handleScroll, true)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("scroll", handleScroll, true)
      window.removeEventListener("resize", handleResize)
    }
  }, [showReveal, isTouch, updatePopupPosition])

  const techniqueLabel = character.technique.type === "breathing" ? "Breathing" : "Blood Demon Art"
  const techniqueName = character.technique.name
  const revealItems = useMemo(() => {
    if (character.technique.type === "breathing") {
      return character.technique.forms.map((form) =>
        form.bestUse ? `${form.title} — ${form.bestUse}` : form.title
      )
    }
    return character.technique.abilities
  }, [character.technique])
  const tagsToShow = character.tags.slice(0, 2)

  const themeVars = useMemo<ThemeVars>(
    () => ({
      "--c1": character.theme.primaryGlow,
      "--c2": character.theme.secondaryGlow,
      "--bg1": character.theme.bg[0],
      "--bg2": character.theme.bg[1],
      "--bg3": character.theme.bg[2],
      "--card-accent": character.theme.primaryGlow,
    }),
    [character.theme.bg, character.theme.primaryGlow, character.theme.secondaryGlow]
  )

  const animateVars = showReveal ? themeVars : baseThemeVars
  const allowHoverReveal = !isTouch && !reduceMotion
  const shouldShowPopup = showReveal && !isTouch

  return (
    <motion.div
      layoutId={`card-${character.slug}`}
      ref={cardRef}
      className="ds-card group relative h-full flex flex-col"
      style={baseThemeVars as CSSProperties}
      animate={{
        ...animateVars,
      }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      onHoverStart={() => {
        if (allowHoverReveal) {
          setShowReveal(true)
        }
      }}
      onHoverEnd={() => {
        if (allowHoverReveal && !isPopupHover) {
          setShowReveal(false)
        }
      }}
    >
      <Link
        href={`/characters/${character.slug}`}
        className="flex flex-col h-full"
        onClick={(event) => {
          setTheme(character.uniformTheme)
          if (isTouch && !showReveal) {
            event.preventDefault()
            setShowReveal(true)
          }
        }}
      >
        <motion.div layoutId={`poster-${character.slug}`} className="relative aspect-[3/4] flex-shrink-0">
          <BreathingAura
            active={showReveal && !isTouch}
            type={character.environment.type}
            primary={character.environment.primary}
            secondary={character.environment.secondary}
          />
          <Image
            src={posterSrc}
            alt={`${character.name} poster`}
            fill
            className="object-cover object-center"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
            quality={92}
            loading="lazy"
            onError={() => setPosterSrc((prev) => resolveFallback(prev))}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: "linear-gradient(180deg, transparent 35%, color-mix(in srgb, var(--c1) 55%, transparent))",
            }}
          />
        </motion.div>
        <div className="flex-1 space-y-2 p-4 sm:p-5 flex flex-col">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">{character.faction}</p>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-primary transition-colors">{character.name}</h3>
            <span className="ds-chip !py-1 !px-2 !text-[9px]">{character.rank}</span>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">{techniqueName}</p>
          <div className="mt-auto flex flex-wrap gap-1.5">
            {tagsToShow.map((tag) => (
              <span key={tag} className="ds-chip !py-0.5 !px-2 !text-[8px] tracking-wider text-white/50">
                {tag}
              </span>
            ))}
          </div>
          {process.env.NODE_ENV !== "production" ? (
            <p className="text-[9px] text-white/30 break-all mt-2">{posterSrc}</p>
          ) : null}
        </div>
      </Link>
      <button
        type="button"
        onClick={() => setShowReveal((prev) => !prev)}
        className="ds-button ds-button--ghost !w-auto !py-1.5 !px-3 absolute right-3 top-3 z-20 text-[10px] sm:hidden"
        aria-expanded={showReveal}
      >
        Reveal
      </button>
      {shouldShowPopup && typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {showReveal ? (
                <motion.div
                  ref={popupRef}
                  className="fixed z-50 hidden flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-depth-2 sm:flex"
                  style={{
                    ...(themeVars as CSSProperties),
                    left: popupStyle?.left ?? 0,
                    top: popupStyle?.top ?? 0,
                    width: popupStyle?.width ?? 320,
                    visibility: popupReady ? "visible" : "hidden",
                  }}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
                  onMouseEnter={() => setIsPopupHover(true)}
                  onMouseLeave={() => {
                    setIsPopupHover(false)
                    setShowReveal(false)
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-80">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(135deg, var(--bg1), var(--bg2), var(--bg3))",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--c1) 40%, transparent), transparent 60%)",
                        opacity: 0.3,
                      }}
                    />
                  </div>
                  <div className="relative space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">{techniqueLabel}</p>
                      <h4 className="text-lg font-semibold text-white">{techniqueName}</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-white/80">
                      {revealItems.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/characters/${character.slug}`}
                      className="ds-button ds-button--ghost inline-flex w-fit"
                      onClick={() => setTheme(character.uniformTheme)}
                    >
                      View full profile
                    </Link>
                  </div>
                  <button type="button" onClick={() => setShowReveal(false)} className="ds-button ds-button--ghost self-end">
                    Close
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
      {showReveal ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 flex sm:hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 24 }}
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowReveal(false)}
          />
          <div className="relative z-10 w-full overflow-hidden rounded-t-3xl border border-white/10 bg-slate-950/80 px-5 pb-6 pt-5">
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background: "linear-gradient(135deg, var(--bg1), var(--bg2), var(--bg3))",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--c1) 40%, transparent), transparent 60%)",
                opacity: 0.3,
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">{techniqueLabel}</p>
                <h4 className="text-lg font-semibold text-white">{techniqueName}</h4>
              </div>
              <button type="button" onClick={() => setShowReveal(false)} className="ds-button ds-button--ghost">
                Close
              </button>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
              {revealItems.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                  <span>{item}</span>
                </li>
              ))}
              </ul>
              <Link
                href={`/characters/${character.slug}`}
                className="ds-button ds-button--ghost mt-4 inline-flex w-fit"
                onClick={() => setTheme(character.uniformTheme)}
              >
                View full profile
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  )
}

export default memo(CharacterCard)
