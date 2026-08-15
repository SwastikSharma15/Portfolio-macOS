"use client"

import { Play, Pause, SkipBack, SkipForward, Speaker } from "lucide-react"
import useAudioStore from "@/store/audio"

export function MusicIsland() {
  const { playlist, currentIndex, isPlaying, togglePlay, next, prev, currentTime, duration } = useAudioStore()
  const currentSong = playlist?.[currentIndex]
  
  // Show the island if there's a song playing or a song is active and time > 0
  const showMusicIsland = isPlaying || (currentSong && currentTime > 0)

  if (!currentSong || !showMusicIsland) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const remaining = duration - currentTime
  let timeRemaining = "0:00"
  if (!isNaN(remaining) && remaining > 0) {
    const minutes = Math.floor(remaining / 60)
    const seconds = Math.floor(remaining % 60)
    timeRemaining = `-${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="absolute top-2 left-1/2 -translate-x-1/2 w-[95%] max-w-[350px] ios26-glass-dark rounded-[32px] overflow-hidden z-[9999] transition-all duration-500 hover:scale-[1.02]"
      style={{
        boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 30px 0 rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
      }}
    >
      <div className="p-3 flex items-center gap-3">
        <img
          src={currentSong.cover || "/placeholder.svg?height=48&width=48"}
          alt={currentSong.title}
          className="w-12 h-12 rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=48&width=48"
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">{currentSong.title}</div>
          <div className="text-xs text-white/70 truncate">{currentSong.author}</div>
          <div className="flex items-center mt-1 gap-2">
            <div className="text-xs text-white/50">{timeRemaining}</div>
            {/* Progress bar */}
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-2">
          <button className="text-white" onClick={prev}>
            <SkipBack className="h-5 w-5" />
          </button>
          <button className="text-white" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          <button className="text-white" onClick={next}>
            <SkipForward className="h-5 w-5" />
          </button>
          <button className="text-white">
            <Speaker className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
