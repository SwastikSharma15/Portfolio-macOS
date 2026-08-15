import { useState, useRef, useEffect } from "react"
import { Battery, Signal, Wifi, Play, Pause, SkipForward, SkipBack, Music } from "lucide-react"
import { formatTime } from "@/lib/utils"
import useAudioStore from "@/store/audio"
import { motion, AnimatePresence } from "framer-motion"

interface StatusBarProps {
  time: Date
  dark?: boolean
}

export function StatusBar({ time, dark = false }: StatusBarProps) {
  const { playlist, currentIndex, isPlaying, togglePlay, next, prev } = useAudioStore()
  const currentSong = playlist?.[currentIndex]
  const [expanded, setExpanded] = useState(false)
  const islandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!expanded) return

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [expanded])

  const showIsland = Boolean(currentSong && (isPlaying || expanded))

  return (
    <div
      className={`relative flex justify-between items-center px-6 pt-3 pb-1 text-sm font-medium select-none ${
        dark ? "text-white ios26-text-glow" : "text-black"
      }`}
    >
      {/* Time */}
      <div className="z-10">{formatTime(time, false)}</div>

      {/* Dynamic Island Music Pill */}
      <AnimatePresence>
        {showIsland && (
          <motion.div
            key="island-container"
            initial={{ scale: 0.7, opacity: 0, y: -20, filter: "blur(5px)" }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scale: 0.7, opacity: 0, y: -20, filter: "blur(5px)" }}
            transition={{ type: "spring", damping: 22, stiffness: 350 }}
            className="absolute left-1/2 -translate-x-1/2 top-2 z-20 pointer-events-auto flex items-center justify-center"
          >
            {/* Soft Glowing Aura */}
            <motion.div
              layout
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`absolute pointer-events-none z-0 bg-gradient-to-r from-purple-500/60 via-pink-500/60 to-blue-500/60 blur-[16px] animate-pulse ${
                expanded
                  ? "w-[310px] h-[80px] rounded-[30px]"
                  : "w-[180px] h-[40px] rounded-full"
              }`}
            />

            <motion.div
              layout
              ref={islandRef}
              onClick={() => setExpanded(!expanded)}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`relative z-10 bg-black/90 backdrop-blur-xl text-white shadow-xl cursor-pointer overflow-hidden border border-white/10 ${
                expanded
                  ? "w-[300px] h-[70px] rounded-[24px] p-3"
                  : "w-[170px] h-[30px] rounded-full px-2.5 flex items-center justify-between"
              }`}
            >
              <AnimatePresence mode="wait">
                {!expanded ? (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="flex items-center justify-between w-full h-full"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {currentSong?.cover ? (
                        <img
                          src={currentSong.cover}
                          alt={currentSong.title}
                          className="w-4 h-4 rounded-full object-cover animate-spin-slow"
                        />
                      ) : (
                        <Music className="w-3.5 h-3.5 text-pink-400" />
                      )}
                      <span className="text-[11px] font-medium truncate max-w-[85px]">
                        {currentSong?.title}
                      </span>
                    </div>

                    {/* Equalizer Wave Animation */}
                    <div className="flex items-end gap-0.5 h-3">
                      <span className={`w-0.5 bg-green-400 rounded-full ${isPlaying ? "animate-pulse h-3" : "h-1"}`} />
                      <span className={`w-0.5 bg-green-400 rounded-full ${isPlaying ? "animate-bounce h-2.5" : "h-1.5"}`} />
                      <span className={`w-0.5 bg-green-400 rounded-full ${isPlaying ? "animate-pulse h-3.5" : "h-2"}`} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between gap-3 h-full"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={currentSong?.cover || "/placeholder.svg"}
                        alt={currentSong?.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate text-white">
                          {currentSong?.title}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">
                          {currentSong?.author}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          prev()
                        }}
                        className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlay()
                        }}
                        className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          next()
                        }}
                        className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Icons */}
      <div className="flex items-center gap-1.5 z-10">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <Battery className="h-4 w-4" />
      </div>
    </div>
  )
}
