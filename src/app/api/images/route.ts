import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const approved = searchParams.get("approved")
    const uploadedBy = searchParams.get("uploadedBy")

    const where: any = {}
    if (approved === "true") where.approved = true
    if (approved === "false") where.approved = false
    if (uploadedBy) where.uploadedBy = uploadedBy

    // If not admin, only show approved images
    if (!session) {
      where.approved = true
    }

    const images = await prisma.image.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
