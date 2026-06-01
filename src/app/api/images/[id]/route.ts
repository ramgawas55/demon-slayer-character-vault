import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { approved } = await request.json()
    const image = await prisma.image.update({
      where: { id: params.id },
      data: { approved },
    })

    return NextResponse.json(image)
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const image = await prisma.image.findUnique({
      where: { id: params.id },
    })

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Delete from Cloudinary
    // Extract public_id from URL
    const parts = image.url.split("/")
    const filename = parts[parts.length - 1]
    const publicId = `demon-slayer-uploads/${filename.split(".")[0]}`
    
    await cloudinary.uploader.destroy(publicId)

    // Delete from DB
    await prisma.image.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
