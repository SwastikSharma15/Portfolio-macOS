"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, ImageIcon, Heart, FolderIcon, Search, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"
import { PhotoDetail } from "./photos/photo-detail"

import { gallery } from "@/constants"

interface Photo {
  id: string
  url: string
  timestamp: number
}

export function Photos() {
  const { closeApp } = useAppState()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedFilter, setSelectedFilter] = useState<"All Photos" | "Days" | "Months" | "Years">("All Photos")
  const [selectedTab, setSelectedTab] = useState<"Library" | "For You" | "Albums" | "Search">("Library")
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  // Load photos from gallery + camera (localStorage)
  useEffect(() => {
    const loadAllPhotos = () => {
      // Load camera-captured photos from localStorage
      const storedPhotos = localStorage.getItem("photos")
      const cameraPhotos: Photo[] = storedPhotos ? JSON.parse(storedPhotos) : []

      // Load pre-set gallery photos
      const formattedGallery: Photo[] = gallery.map((item, index) => ({
        id: `gallery-${item.id.toString()}`,
        url: item.img,
        timestamp: Date.now() - (index + 1) * 86400000, // mock timestamps, older than camera photos
      }))

      // Camera photos first (newest on top), then gallery
      setPhotos([...cameraPhotos, ...formattedGallery])
    }

    loadAllPhotos()

    // Listen for storage changes so photos update if the camera saves while gallery is open
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "photos") {
        loadAllPhotos()
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])



  const deleteSelectedPhotos = () => {
    const newPhotos = photos.filter((photo) => !selectedPhotos.has(photo.id))
    setPhotos(newPhotos)

    // Also remove camera photos from localStorage
    const storedPhotos = localStorage.getItem("photos")
    if (storedPhotos) {
      const cameraPhotos = JSON.parse(storedPhotos)
      const updatedCameraPhotos = cameraPhotos.filter(
        (p: Photo) => !selectedPhotos.has(p.id)
      )
      localStorage.setItem("photos", JSON.stringify(updatedCameraPhotos))
    }

    setSelectedPhotos(new Set())
    setIsSelecting(false)
  }

  const deletePhoto = (id: string) => {
    const newPhotos = photos.filter((photo) => photo.id !== id)
    setPhotos(newPhotos)

    // Also remove from localStorage if it's a camera photo
    if (!id.startsWith("gallery-")) {
      const storedPhotos = localStorage.getItem("photos")
      if (storedPhotos) {
        const cameraPhotos = JSON.parse(storedPhotos)
        const updatedCameraPhotos = cameraPhotos.filter(
          (p: Photo) => p.id !== id
        )
        localStorage.setItem("photos", JSON.stringify(updatedCameraPhotos))
      }
    }

    setSelectedPhoto(null)
  }

  const togglePhotoSelection = (id: string) => {
    const newSelected = new Set(selectedPhotos)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedPhotos(newSelected)
  }

  const handlePhotoClick = (photo: Photo) => {
    if (isSelecting) {
      togglePhotoSelection(photo.id)
    } else {
      setSelectedPhoto(photo)
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filters = ["Years", "Months", "Days", "All Photos"] as const
  const tabs = [
    { id: "Library", icon: ImageIcon },
    { id: "For You", icon: Heart },
    { id: "Albums", icon: FolderIcon },
    { id: "Search", icon: Search },
  ] as const

  // If a photo is selected, show the photo detail view
  if (selectedPhoto) {
    return <PhotoDetail photo={selectedPhoto} onBack={() => setSelectedPhoto(null)} onDelete={deletePhoto} />
  }

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-2 px-4 bg-white/75 backdrop-blur-xl border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <button onClick={closeApp} className="text-blue-500 flex items-center gap-0 -ml-1">
            <ChevronLeft className="h-7 w-7 stroke-[2.5]" />
            <span className="text-[17px]">Back</span>
          </button>
          <h1 className="text-[17px] font-semibold absolute left-1/2 -translate-x-1/2">
            {isSelecting ? `${selectedPhotos.size} Selected` : "Photos"}
          </h1>
          <div className="flex gap-4">
            <button onClick={() => setIsSelecting(!isSelecting)} className="text-blue-500 font-medium text-[17px]">
              {isSelecting ? "Cancel" : "Select"}
            </button>
            {!isSelecting && (
              <button className="text-blue-500">
                <MoreHorizontal className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="flex-1 overflow-auto px-1 pt-2">
        <div className="columns-2 md:columns-3 gap-2 space-y-2 p-1">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className={cn("relative overflow-hidden break-inside-avoid rounded-md", "cursor-pointer")}
              onClick={() => handlePhotoClick(photo)}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={photo.url || "/placeholder.svg"}
                alt={`Photo from ${formatDate(photo.timestamp)}`}
                className="w-full h-full object-cover"
              />
              {isSelecting && (
                <div className={cn("absolute inset-0 bg-black/20", selectedPhotos.has(photo.id) && "bg-blue-500/20")}>
                  <div
                    className={cn(
                      "absolute top-2 right-2 w-5 h-5 rounded-full border-2",
                      selectedPhotos.has(photo.id) ? "bg-blue-500 border-blue-500" : "border-white",
                    )}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 flex justify-between border-t">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={cn(
              "px-4 py-1 rounded-full text-sm",
              selectedFilter === filter ? "bg-gray-200 font-medium" : "text-gray-500",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center py-2 border-t bg-white">
        {tabs.map(({ id, icon: Icon }) => (
          <button key={id} onClick={() => setSelectedTab(id)} className="flex flex-col items-center gap-1">
            <Icon className={cn("h-6 w-6", selectedTab === id ? "text-blue-500" : "text-gray-400")} />
            <span className={cn("text-xs", selectedTab === id ? "text-blue-500" : "text-gray-400")}>{id}</span>
          </button>
        ))}
      </div>

      {/* Delete Button */}
      {isSelecting && selectedPhotos.size > 0 && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center">
          <button onClick={deleteSelectedPhotos} className="bg-red-500 text-white px-6 py-2 rounded-full">
            Delete {selectedPhotos.size} Photo{selectedPhotos.size !== 1 ? "s" : ""}
          </button>
        </div>
      )}
    </div>
  )
}
