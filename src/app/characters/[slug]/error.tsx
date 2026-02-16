"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error)
    }
  }, [error])

  const showDebug = process.env.NODE_ENV !== "production"

  return (
    <main className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center gap-6 px-6 py-16">
      <div className="text-xs uppercase tracking-[0.4em] text-white/60">Error</div>
      <h1 className="text-4xl font-semibold text-white sm:text-5xl">Something went wrong</h1>
      <p className="max-w-xl text-base text-white/70">
        The character page failed to load. Try again or return to the vault.
      </p>
      {showDebug ? (
        <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-xs text-white/70">
          <div className="uppercase tracking-[0.2em]">Debug</div>
          <div className="mt-2 break-words">{error.message}</div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => reset()} className="ds-button">
          Retry
        </button>
        <Link href="/" className="ds-button ds-button--ghost">
          Back
        </Link>
      </div>
    </main>
  )
}
