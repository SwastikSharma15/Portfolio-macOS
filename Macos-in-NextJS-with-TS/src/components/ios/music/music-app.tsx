"use client"

import { useState, useEffect } from "react"
import { HomeView } from "./home-view"
import { SearchView } from "./search-view"
import { LibraryView } from "./library-view"
import { MusicPlayer } from "./music-player"
import { Home, Library, Search } from "lucide-react"
import useAudioStore from "@/store/audio"
import { songs } from "@/constants"

export function MusicApp() {
  const [activeTab, setActiveTab] = useState<"home" | "library" | "search">("home")
  const { init } = useAudioStore()

  useEffect(() => {
    init(songs)
  }, [init])

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-hidden">
        {activeTab === "home" && <HomeView />}
        {activeTab === "library" && <LibraryView />}
        {activeTab === "search" && <SearchView />}
      </div>

      <MusicPlayer />

      {/* Bottom Tab Bar */}
      <div className="flex justify-around items-center py-2 border-t z-10 bg-white/80 backdrop-blur-md">
        <button
          className={`flex flex-col items-center p-2 ${activeTab === "home" ? "text-red-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("home")}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          className={`flex flex-col items-center p-2 ${activeTab === "library" ? "text-red-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("library")}
        >
          <Library className="h-6 w-6" />
          <span className="text-xs mt-1">Library</span>
        </button>
        <button
          className={`flex flex-col items-center p-2 ${activeTab === "search" ? "text-red-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("search")}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </button>
      </div>
    </div>
  )
}
