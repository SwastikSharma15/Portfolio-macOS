"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { StatusBar } from "@/components/ios/status-bar"
import { formatDate, formatTime } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"

interface LockScreenProps {
  time: Date
}

export function LockScreen({ time }: LockScreenProps) {
  const { unlockDevice } = useAppState()
  const [swipeProgress, setSwipeProgress] = useState(0)

  const handleDragEnd = () => {
    if (swipeProgress > 0.5) {
      unlockDevice()
    }
    setSwipeProgress(0)
  }

  return (
    <div className="relative h-full w-full flex flex-col">
      <StatusBar time={time} dark />

      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <div className="text-6xl font-extralight mb-1">{formatTime(time)}</div>
        <div className="text-lg">{formatDate(time)}</div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-16"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={(_, info) => {
          const progress = Math.min(Math.max(-info.offset.y / 100, 0), 1)
          setSwipeProgress(progress)
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="text-white/70 text-sm mb-2">Swipe up to unlock</div>
        <div className="w-10 h-1 bg-white/50 rounded-full"></div>
      </motion.div>

      {/* Overlay that fades out as you swipe */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: 0.3 - swipeProgress * 0.3 }}
      />
    </div>
  )
}
