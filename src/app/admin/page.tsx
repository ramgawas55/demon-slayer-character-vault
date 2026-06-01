"use client"

import React, { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Trash2, Filter, User, Shield, ExternalLink, Loader2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

interface ImageData {
  id: string
  url: string
  uploadedBy: string
  approved: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState({
    approved: "all", // "all", "true", "false"
    uploadedBy: "all", // "all", "user", "admin"
  })

  const fetchImages = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.approved !== "all") params.append("approved", filter.approved)
      if (filter.uploadedBy !== "all") params.append("uploadedBy", filter.uploadedBy)
      
      const response = await fetch(`/api/images?${params.toString()}`)
      const data = await response.json()
      setImages(data)
    } catch (error) {
      toast.error("Failed to load images")
    } finally {
      setIsLoading(false)
    }
  }, [filter.approved, filter.uploadedBy])

  useEffect(() => {
    fetchImages()
  }, [filter.approved, filter.uploadedBy, fetchImages])

  const handleApprove = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !currentStatus }),
      })
      if (response.ok) {
        toast.success(currentStatus ? "Image unapproved" : "Image approved")
        fetchImages()
      }
    } catch (error) {
      toast.error("Update failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        toast.success("Image deleted")
        setImages(images.filter((img) => img.id !== id))
      }
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] p-4 sm:p-6 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Management Dashboard</h1>
            <p className="text-sm text-white/60">Review and moderate asset submissions.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex w-full sm:w-auto items-center gap-1 rounded-2xl bg-white/5 p-1 overflow-x-auto hide-scrollbar">
              {["all", "false", "true"].map((val) => (
                <button
                  key={val}
                  onClick={() => setFilter({ ...filter, approved: val })}
                  className={cn(
                    "flex-1 sm:flex-none rounded-xl px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition whitespace-nowrap",
                    filter.approved === val ? "bg-white text-slate-950" : "text-white/40 hover:text-white"
                  )}
                >
                  {val === "all" ? "All" : val === "true" ? "Approved" : "Pending"}
                </button>
              ))}
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex h-64 sm:h-96 items-center justify-center">
            <Loader2 className="animate-spin text-white/20" size={32} />
          </div>
        ) : images.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative flex flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-white/5 transition-all hover:border-white/20"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-900">
                    <Image
                      src={image.url}
                      alt="Submission"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    
                    <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 z-20">
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                          {image.uploadedBy === "admin" ? (
                            <Shield size={10} className="text-blue-400" />
                          ) : (
                            <User size={10} />
                          )}
                          {image.uploadedBy}
                        </div>
                        <p className="text-[9px] text-white/20">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={cn(
                        "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-tighter",
                        image.approved ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                      )}>
                        {image.approved ? "Approved" : "Pending"}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(image.id, image.approved)}
                        className={cn(
                          "ds-button !w-auto flex-1 !py-2.5 !text-[10px]",
                          image.approved 
                            ? "border border-white/10 text-white hover:bg-white/5" 
                            : "bg-green-500 text-slate-950 hover:bg-green-400"
                        )}
                      >
                        <Check size={14} className="mr-1.5" />
                        {image.approved ? "Unapprove" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 text-red-500 transition hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/10 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-white/20">
              <ImageIcon size={40} />
            </div>
            <h3 className="text-xl font-bold">No submissions found</h3>
            <p className="text-white/40">Try adjusting your filters or wait for new uploads.</p>
          </div>
        )}
      </div>
    </div>
  )
}
