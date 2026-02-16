import Link from "next/link"

export default function NotFound() {
  return (
    <main className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center gap-6 px-6 py-16">
      <div className="text-xs uppercase tracking-[0.4em] text-white/60">Error</div>
      <h1 className="text-4xl font-semibold text-white sm:text-5xl">Character not found</h1>
      <p className="max-w-xl text-base text-white/70">
        The character slug does not match any entry in the current dataset.
      </p>
      <Link href="/" className="ds-button ds-button--ghost">
        Back
      </Link>
    </main>
  )
}
