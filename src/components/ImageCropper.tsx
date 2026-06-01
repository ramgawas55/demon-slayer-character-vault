"use client"

import React, { useState, useCallback } from "react"
import Cropper, { Area, Point } from "react-easy-crop"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Square, Image as ImageIcon } from "lucide-react"

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setCropZoom] = useState(1)
  const [aspect, setAspect] = useState(1 / 1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = (crop: Point) => setCrop(crop)
  const onZoomChange = (zoom: number) => setCropZoom(zoom)

  const onCropAreaComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const getCroppedImg = async () => {
    if (!croppedAreaPixels) return

    const canvas = document.createElement("canvas")
    const img = new Image()
    img.src = image

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error("Canvas is empty"))
        },
        "image/webp",
        0.8
      )
    })
  }

  const handleDone = async () => {
    try {
      const croppedBlob = await getCroppedImg()
      if (croppedBlob) {
        onCropComplete(croppedBlob)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 sm:p-6"
    >
      <div className="relative flex h-[85vh] max-h-[700px] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] sm:rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Crop Image</h3>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setAspect(1 / 1)}
              className={`rounded-xl p-2.5 transition-colors ${
                aspect === 1 / 1 ? "bg-white/20 text-white" : "text-white/40 hover:text-white"
              }`}
              title="Square (1:1)"
            >
              <Square size={18} />
            </button>
            <button
              onClick={() => setAspect(16 / 9)}
              className={`rounded-xl p-2.5 transition-colors ${
                aspect === 16 / 9 ? "bg-white/20 text-white" : "text-white/40 hover:text-white"
              }`}
              title="Landscape (16:9)"
            >
              <ImageIcon size={18} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-950">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaComplete}
          />
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="ds-button ds-button--ghost !w-auto flex-1 !py-3 !text-[11px]"
            >
              <X size={16} className="mr-2" /> Cancel
            </button>
            <button
              onClick={handleDone}
              className="ds-button !w-auto flex-[2] !py-3 !text-[11px] !bg-white !text-slate-950"
            >
              <Check size={16} className="mr-2" /> Apply
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
