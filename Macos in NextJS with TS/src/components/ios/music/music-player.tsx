"use client"

import useAudioStore from "@/store/audio"
import { Play, Pause, SkipBack, SkipForward, List } from "lucide-react"
import { useState } from "react"
import { QueueView } from "./queue-view"
import { FullScreenPlayer } from "./full-screen-player"

export function MusicPlayer() {
  const [showQueue, setShowQueue] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { 
    playlist, 
    currentIndex, 
    isPlaying, 
    currentTime, 
    duration, 
    togglePlay, 
    next, 
    prev, 
    seek 
  } = useAudioStore()

  const currentSong = playlist?.[currentIndex]

  if (!currentSong) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      <div 
        className="border-t bg-white p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsFullScreen(true)}
      >
        <div className="flex items-center gap-4">
          <img
            src={currentSong.cover || "/placeholder.svg?height=48&width=48"}
            alt={currentSong.title}
            className="w-12 h-12 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=48&width=48"
            }}
          />

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{currentSong.title}</div>
            <div className="text-xs text-gray-500 truncate">{currentSong.author}</div>
          </div>

          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button className="text-gray-400" onClick={() => setShowQueue(true)}>
              <List className="h-5 w-5" />
            </button>
            <button className="text-gray-400" onClick={prev}>
              <SkipBack className="h-6 w-6" />
            </button>
            <button
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center`}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <button className="text-gray-400" onClick={next}>
              <SkipForward className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 relative group w-full h-4 flex items-center" onClick={(e) => e.stopPropagation()}>
          {/* Track background */}
          <div className="absolute w-full h-1 bg-gray-200 rounded-full overflow-hidden transition-all duration-300 group-hover:h-1.5">
            {/* Filled part */}
            <div className="h-full bg-red-500 transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
          </div>
          
          {/* Thumb */}
          <div
            className="absolute h-2.5 w-2.5 bg-red-500 rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform duration-200 pointer-events-none"
            style={{ left: `calc(${progress}% - 5px)` }}
          />

          {/* Invisible Native Input */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer touch-none"
          />
        </div>
      </div>

      {/* Queue View */}
      <QueueView isOpen={showQueue} onClose={() => setShowQueue(false)} />

      {/* Full Screen Player */}
      <FullScreenPlayer isOpen={isFullScreen} onClose={() => setIsFullScreen(false)} />
    </>
  )
}
