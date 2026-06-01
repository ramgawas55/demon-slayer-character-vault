import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "demon-slayer-uploads",
            resource_type: "image",
          },
          (error: any, result: any) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })

    const imageUrl = (uploadResult as any).secure_url

    // Save to database
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        uploadedBy: session ? "admin" : "user",
        approved: !!session, // Auto-approve if admin
      },
    })

    return NextResponse.json({ success: true, url: imageUrl, id: image.id })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
