"use client"

import type React from "react"
import { Sun, Volume2 } from "lucide-react"
import { useAppState } from "@/lib/app-state"
import useAudioStore from "@/store/audio"

interface SliderModuleProps {
  type: "brightness" | "volume"
}

export function SliderModule({ type }: SliderModuleProps) {
  const { brightness, setBrightness } = useAppState()
  const { volume, setVolume } = useAudioStore()

  const value = type === "brightness" ? brightness : volume * 100

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseInt(e.target.value)
    if (type === "brightness") {
      setBrightness(val)
    } else {
      setVolume(val / 100)
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-3 flex items-center">
      <div className="mr-3">
        {type === "brightness" ? <Sun className="h-5 w-5 text-black" /> : <Volume2 className="h-5 w-5 text-black" />}
      </div>

      <div className="flex-1">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, black ${value}%, rgba(0,0,0,0.2) ${value}%)`,
          }}
        />
      </div>
    </div>
  )
}
