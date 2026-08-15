"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, MoreHorizontal, Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, Volume2, VolumeX, List } from "lucide-react"
import useAudioStore from "@/store/audio"
import { useState } from "react"
import { QueueView } from "./queue-view"

interface FullScreenPlayerProps {
  isOpen: boolean
  onClose: () => void
}

export function FullScreenPlayer({ isOpen, onClose }: FullScreenPlayerProps) {
  const {
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    shuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeatMode
  } = useAudioStore()

  const [showQueue, setShowQueue] = useState(false)
  const currentSong = playlist?.[currentIndex]

  if (!currentSong) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0



  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-12 relative z-10">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronDown className="h-6 w-6 text-gray-700" />
            </button>
            <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Now Playing</div>
            <button
              className="text-gray-500 hover:text-gray-800 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowQueue(true)}
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          {/* Artwork */}
          <div className="flex-1 flex items-center justify-center p-8 mt-4">
            <motion.div
              className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl"
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <img
                src={currentSong.cover || "/placeholder.svg?height=400&width=400"}
                alt={currentSong.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                }}
              />
            </motion.div>
          </div>

          {/* Info & Controls */}
          <div className="p-8 pb-12 pt-0">
            <div className="mb-6 flex justify-between items-end">
              <div className="min-w-0 pr-4">
                <h2 className="text-2xl font-bold truncate mb-1">{currentSong.title}</h2>
                <p className="text-lg text-red-500 truncate">{currentSong.author}</p>
              </div>
              <button
                className="text-gray-400 p-2 bg-gray-100 hover:bg-gray-200 rounded-full mb-1 flex-shrink-0 transition-colors"
                onClick={toggleMute}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="relative group w-full h-6 flex items-center mb-1">
                {/* Track background */}
                <div className="absolute w-full h-1.5 bg-gray-200 rounded-full overflow-hidden transition-all duration-300 group-hover:h-2">
                  {/* Filled part */}
                  <div
                    className="h-full bg-red-500 transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {/* Thumb */}
                <div
                  className="absolute h-3 w-3 bg-red-500 rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform duration-200 pointer-events-none"
                  style={{ left: `calc(${progress}% - 6px)` }}
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
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(duration - currentTime)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={toggleShuffle}
                className={shuffle ? "text-red-500" : "text-gray-400"}
              >
                <Shuffle className="h-5 w-5" />
              </button>
              <button className="text-gray-800" onClick={prev}>
                <SkipBack className="h-8 w-8 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center shadow-sm"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 fill-current" />
                )}
              </button>
              <button className="text-gray-800" onClick={next}>
                <SkipForward className="h-8 w-8 fill-current" />
              </button>
              <button
                onClick={toggleRepeatMode}
                className={repeatMode !== 'none' ? "text-red-500" : "text-gray-400"}
              >
                {repeatMode === 'repeat-one' ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <QueueView isOpen={showQueue} onClose={() => setShowQueue(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
