import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

type OverrideImages = {
  posterUrl: string
  galleryUrls: string[]
}

const overridesPath = path.join(process.cwd(), "src", "data", "overrides.json")

const readOverrides = async (): Promise<Record<string, OverrideImages>> => {
  try {
    const data = await fs.readFile(overridesPath, "utf-8")
    return JSON.parse(data) as Record<string, OverrideImages>
  } catch {
    return {}
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  const overrides = await readOverrides()
  if (slug) {
    return NextResponse.json({ images: overrides[slug] })
  }
  return NextResponse.json({ overrides })
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    slug?: string
    images?: OverrideImages
    password?: string
  }
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || body.password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!body.slug || !body.images) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  const overrides = await readOverrides()
  overrides[body.slug] = body.images
  await fs.writeFile(overridesPath, JSON.stringify(overrides, null, 2))
  return NextResponse.json({ ok: true })
}
