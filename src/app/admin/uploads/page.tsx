"use client"

import { useState } from "react"

type UploadItem = {
  name: string
  file: File
}

const uploadFile = async (file: File, password: string, filename: string) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("password", password)
  formData.append("filename", filename)
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
  if (!response.ok) {
    const payload = await response.json()
    throw new Error(payload.error ?? "Upload failed")
  }
  const payload = (await response.json()) as { url: string }
  return payload.url
}

export default function UploadsPage() {
  const [password, setPassword] = useState("")
  const [slug, setSlug] = useState("")
  const [poster, setPoster] = useState<File | null>(null)
  const [gallery, setGallery] = useState<UploadItem[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleGalleryChange = (files: FileList | null) => {
    if (!files) {
      setGallery([])
      return
    }
    const items = Array.from(files).map((file) => ({ name: file.name, file }))
    setGallery(items)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!slug || !poster) {
      setStatus("Provide a slug and poster image.")
      return
    }
    if (!password) {
      setStatus("Enter the admin password.")
      return
    }
    setBusy(true)
    setStatus(null)
    try {
      const posterUrl = await uploadFile(
        poster,
        password,
        `${slug}/poster-${Date.now()}-${poster.name}`
      )
      const galleryUrls = await Promise.all(
        gallery.map((item) =>
          uploadFile(item.file, password, `${slug}/gallery-${Date.now()}-${item.name}`)
        )
      )

      const response = await fetch("/api/overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          images: { posterUrl, galleryUrls },
          password,
        }),
      })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload.error ?? "Failed to save overrides")
      }
      setStatus("Upload complete.")
      setPoster(null)
      setGallery([])
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 pb-24 pt-16">
        <h1 className="text-2xl font-semibold uppercase tracking-[0.3em]">Admin Uploads</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
          />
          <input
            type="text"
            placeholder="Character slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
          />
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Poster</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setPoster(event.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">
              Gallery images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => handleGalleryChange(event.target.files)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs uppercase tracking-[0.35em] text-white transition hover:border-white/70 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Uploading..." : "Upload"}
          </button>
        </form>
        {status ? <p className="text-sm text-white/70">{status}</p> : null}
      </main>
    </div>
  )
}
