"use client"

import { useEffect } from "react"
import useAudioStore from "@/store/audio"
import { SkipBack, Play, Pause, SkipForward, Music } from "lucide-react"
import { useAppState } from "@/lib/app-state"
import { songs } from "@/constants"

export function MusicModule() {
  const { playlist, currentIndex, isPlaying, togglePlay, next, prev, init } = useAudioStore()
  const { openApp, closeControlCenter } = useAppState()

  useEffect(() => {
    init(songs)
  }, [init])

  // Use the currently selected song, or fallback to the first song in the playlist, or the first song from constants
  const currentSong = playlist?.[currentIndex]
  const songToDisplay = currentSong || playlist?.[0] || songs[0]

  const handleOpenMusic = () => {
    openApp("music")
    closeControlCenter()
  }

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-3 aspect-square flex flex-col h-full min-w-0">
      <div className="flex flex-col items-center mb-2 flex-1 justify-center w-full min-w-0">
        <div
          className="w-24 h-16 rounded-xl overflow-hidden mb-2 cursor-pointer flex-shrink-0 bg-gray-200 flex items-center justify-center shadow-sm"
          onClick={handleOpenMusic}
        >
          {songToDisplay && (
            <img
              src={songToDisplay.cover || "/placeholder.svg?height=64&width=96"}
              alt={songToDisplay.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div
          className="w-full text-center cursor-pointer min-w-0"
          onClick={handleOpenMusic}
        >
          <h3 className="text-black text-sm font-semibold truncate leading-tight w-full block">
            {songToDisplay?.title}
          </h3>
          <p className="text-black/70 text-xs truncate mt-0.5 w-full block">
            {songToDisplay?.author}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto px-2">
        <button className="text-black" onClick={prev} disabled={!songToDisplay}>
          <SkipBack className={`h-5 w-5 ${!songToDisplay && "opacity-50"}`} />
        </button>

        <button className="text-black" onClick={togglePlay} disabled={!songToDisplay}>
          {isPlaying ? <Pause className="h-7 w-7" /> : <Play className={`h-7 w-7 ${!songToDisplay && "opacity-50"}`} />}
        </button>

        <button className="text-black" onClick={next} disabled={!songToDisplay}>
          <SkipForward className={`h-5 w-5 ${!songToDisplay && "opacity-50"}`} />
        </button>
      </div>
    </div>
  )
}
