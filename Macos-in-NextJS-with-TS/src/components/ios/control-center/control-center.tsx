"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAppState } from "@/lib/app-state"
import { useEffect, useState } from "react"
import useAudioStore from "@/store/audio"
import { ConnectivityModule } from "./modules/connectivity-module"
import { MusicModule } from "./modules/music-module"
import { ScreenModule } from "./modules/screen-module"
import { SliderModule } from "./modules/slider-module"
import { FocusModule } from "./modules/focus-module"
import { UtilityModule } from "./modules/utility-module"
import { StatusBar } from "../status-bar"

export function ControlCenter() {
  const { controlCenterOpen, closeControlCenter } = useAppState()
  const { playlist, currentIndex } = useAudioStore()
  const currentSong = playlist?.[currentIndex]
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {controlCenterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/20"
            onClick={closeControlCenter}
          />

          {/* Control Center Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: "15%", y: "-15%", borderRadius: "60px" }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0, borderRadius: "0px" }}
            exit={{ opacity: 0, scale: 0.9, x: "15%", y: "-15%", borderRadius: "60px" }}
            transition={{ type: "spring", damping: 28, stiffness: 350, mass: 0.8 }}
            className="fixed inset-0 z-[9999] overflow-auto bg-white/40 backdrop-blur-[40px] border border-white/20 transform-gpu"
          >
            <div className="min-h-full w-full p-4 pt-0">
              <StatusBar time={time} dark={false} />

              <div className="grid grid-cols-2 gap-3 mt-2">
                {/* Connectivity Module */}
                <ConnectivityModule />

                {/* Music Module */}
                <MusicModule />

                {/* Focus Mode */}
                <FocusModule />

                {/* Brightness & Volume Sliders */}
                <div className="grid grid-cols-1 gap-3">
                  <SliderModule type="brightness" />
                  <SliderModule type="volume" />
                </div>

                {/* Screen Mirroring & Rotation Lock */}
                <div className="grid grid-cols-2 gap-3">
                  <ScreenModule icon="lock" label="Rotation" />
                  <UtilityModule icon="flashlight" />
                </div>

                {/* Utilities */}
                <div className="grid grid-cols-2 gap-3">
                  <UtilityModule icon="calculator" />
                  <UtilityModule icon="camera" />
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
