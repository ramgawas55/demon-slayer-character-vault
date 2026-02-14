import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file")
  const password = formData.get("password")
  const filename = formData.get("filename")

  const expected = process.env.ADMIN_PASSWORD
  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  const safeName = typeof filename === "string" && filename.length > 0 ? filename : file.name
  const blob = await put(safeName, file, { access: "public" })

  return NextResponse.json({ url: blob.url })
}
