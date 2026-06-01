"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react"
import ImageCropper from "@/components/ImageCropper"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import Image from "next/image"

export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null)
  const [isUploading, setIsBusy] = useState(false)
  const [uploadProgress, setProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image too large (max 10MB)")
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setIsCropping(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (blob: Blob) => {
    setCroppedBlob(blob)
    setCroppedPreview(URL.createObjectURL(blob))
    setIsCropping(false)
  }

  const handleUpload = async () => {
    if (!croppedBlob) return

    setIsBusy(true)
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append("file", croppedBlob, "upload.webp")

      // Mock progress for better UX
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev))
      }, 300)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(interval)
      setProgress(100)

      const data = await response.json()
      if (data.success) {
        setUploadedUrl(data.url)
        toast.success("Image uploaded successfully!")
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
      setProgress(0)
    } finally {
      setIsBusy(false)
    }
  }

  const reset = () => {
    setSelectedImage(null)
    setCroppedBlob(null)
    setCroppedPreview(null)
    setUploadedUrl(null)
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] px-4 py-8 sm:px-6 sm:py-20 text-white">
      <div className="mx-auto w-full max-w-md sm:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 sm:space-y-8"
        >
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Upload Asset</h1>
            <p className="text-sm sm:text-base text-white/60">Share your high-quality Demon Slayer artwork.</p>
          </div>

          {!uploadedUrl ? (
            <div className="space-y-6">
              {!croppedPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "group relative flex h-64 sm:h-80 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/[0.07]",
                    isCropping && "pointer-events-none opacity-50"
                  )}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-white/5 transition-transform group-hover:scale-110">
                    <Upload className="text-white/60" size={20} />
                  </div>
                  <div className="mt-4 text-center px-4">
                    <p className="text-base sm:text-lg font-medium">Click or drag to upload</p>
                    <p className="text-xs sm:text-sm text-white/40">PNG, JPG or WebP (max 10MB)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative aspect-square overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-white/5">
                    <Image
                      src={croppedPreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                    <button
                      onClick={reset}
                      className="absolute right-3 top-3 sm:right-4 sm:top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md transition hover:bg-black/80 z-20"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {isUploading ? (
                    <div className="space-y-4 px-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="flex items-center gap-2 text-white/60">
                          <Loader2 className="animate-spin" size={16} />
                          Uploading...
                        </span>
                        <span className="font-mono">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          className="h-full bg-white"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleUpload}
                      className="ds-button relative z-10"
                    >
                      Confirm & Upload
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-green-500/20 text-green-500">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="mb-2 text-xl sm:text-2xl font-bold">Upload Successful!</h2>
              <p className="mb-8 text-xs sm:text-sm text-white/60">Your image has been saved and is awaiting approval.</p>
              
              <div className="relative mb-8 aspect-video overflow-hidden rounded-xl sm:rounded-2xl border border-white/10">
                <Image
                  src={uploadedUrl}
                  alt="Uploaded"
                  fill
                  className="object-cover"
                />
              </div>

              <button
                onClick={reset}
                className="ds-button ds-button--ghost"
              >
                Upload Another
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isCropping && selectedImage && (
          <ImageCropper
            image={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={() => setIsCropping(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
