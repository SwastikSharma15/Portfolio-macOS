"use client"

import { useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppIcon } from "./app-icon"

interface AppCategory {
  id: string
  name: string
  apps: Array<{
    id: string
    name: string
    color: string
    icon: string
  }>
}

// App categories based on functionality
const appCategories: AppCategory[] = [
  {
    id: "productivity",
    name: "Productivity",
    apps: [
      { id: "calendar", name: "Calendar", color: "", icon: "calendar" },
      { id: "notes", name: "Notes", color: "", icon: "notes" },
      { id: "clock", name: "Clock", color: "", icon: "clock" },
    ],
  },
  {
    id: "utilities",
    name: "Utilities",
    apps: [
      { id: "settings", name: "Settings", color: "", icon: "settings" },
      { id: "maps", name: "Maps", color: "", icon: "maps" },
      { id: "finder", name: "Finder", color: "", icon: "finder" },
      { id: "contact", name: "Contact", color: "", icon: "contact" },
      { id: "calculator", name: "Calculator", color: "", icon: "calculator" },
    ],
  },
  {
    id: "creativity",
    name: "Creativity & Games",
    apps: [
      { id: "camera", name: "Camera", color: "", icon: "camera" },
      {
        id: "photos",
        name: "Photos",
        color: "",
        icon: "photos",
      },
      { id: "games", name: "Games", color: "", icon: "games" },
    ],
  },
  {
    id: "connectivity",
    name: "Connectivity & Media",
    apps: [
      { id: "phone", name: "Phone", color: "", icon: "phone" },
      { id: "messages", name: "Messages", color: "", icon: "messages" },
      { id: "safari", name: "Safari", color: "", icon: "safari" },
      { id: "music", name: "Music", color: "", icon: "music" },
    ],
  },
]

interface AppLibraryProps {
  isVisible: boolean
  onClose: () => void
}

export function AppLibrary({ isVisible, onClose }: AppLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const dragX = useMotionValue(0)

  // Transform values for animation effects
  const opacity = useTransform(dragX, [0, 100], [1, 0.8], {
    clamp: true,
  })
  const scale = useTransform(dragX, [0, 100], [1, 0.98], {
    clamp: true,
  })

  // Filter apps based on search query
  const filteredCategories = searchQuery
    ? appCategories
      .map((category) => ({
        ...category,
        apps: category.apps.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase())),
      }))
      .filter((category) => category.apps.length > 0)
    : appCategories

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 1,
          }}
          className="absolute inset-0 bg-white/40 backdrop-blur-xl z-50 select-none"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0.05, right: 1 }}
          dragDirectionLock
          dragTransition={{
            bounceStiffness: 600,
            bounceDamping: 30,
          }}
          style={{
            x: dragX,
            opacity,
            scale,
          }}
          onDragEnd={(event, info) => {
            // Close the app library if swiped right (positive x offset)
            if (info.offset.x > 80 || info.velocity.x > 300) {
              onClose()
            } else {
              // Reset drag position
              dragX.set(0)
            }
          }}
        >


          {/* Search Bar */}
          <div className="px-4 pt-12 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="App Library"
                className="w-full h-9 bg-black/10 backdrop-blur-xl rounded-lg pl-9 pr-4 text-black placeholder-black/60 outline-none select-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />
            </div>
          </div>

          {/* App Categories Grid */}
          <div
            className="px-4 pb-4 overflow-y-auto overflow-x-hidden h-[calc(100%-6rem)]"
            style={{ touchAction: "pan-y" }}
          >
            <div className="grid grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="relative aspect-square bg-black/5 backdrop-blur-xl rounded-2xl p-2 overflow-hidden">
                    <div className="grid grid-cols-2 gap-2 h-full">
                      {category.apps.slice(0, 4).map((app) => (
                        <div key={app.id} className="relative w-full h-full aspect-square">
                          <AppIcon id={app.id} name={app.name} color={app.color} icon={app.icon} size="small" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-white/90 text-center font-medium select-none">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
