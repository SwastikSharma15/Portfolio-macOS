"use client"

import { useState } from "react"
import { Flashlight, Timer, Calculator, Camera, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"

interface UtilityModuleProps {
  icon: "flashlight" | "timer" | "calculator" | "camera" | "qrcode"
}

export function UtilityModule({ icon }: UtilityModuleProps) {
  const [isActive, setIsActive] = useState(false)
  const { openApp, closeControlCenter } = useAppState()

  const handleClick = () => {
    if (icon === "flashlight" || icon === "qrcode") {
      setIsActive(!isActive)
    } else {
      closeControlCenter()

      // Open corresponding app
      if (icon === "camera") {
        openApp("camera")
      } else if (icon === "calculator") {
        openApp("calculator")
      } else if (icon === "timer") {
        openApp("clock")
      }
    }
  }

  const getIcon = () => {
    switch (icon) {
      case "flashlight":
        return <Flashlight className="h-6 w-6 text-black" />
      case "timer":
        return <Timer className="h-6 w-6 text-black" />
      case "calculator":
        return <Calculator className="h-6 w-6 text-black" />
      case "camera":
        return <Camera className="h-6 w-6 text-black" />
      case "qrcode":
        return <QrCode className="h-6 w-6 text-black" />
    }
  }

  const getBackgroundColor = () => {
    if (!isActive) return "bg-white/20"

    switch (icon) {
      case "flashlight":
        return "bg-yellow-500/50"
      case "qrcode":
        return "bg-white/20"
      default:
        return "bg-white/5"
    }
  }

  return (
    <button
      className={cn(
        "rounded-full flex items-center justify-center aspect-square transition-colors",
        getBackgroundColor(),
      )}
      onClick={handleClick}
    >
      {getIcon()}
    </button>
  )
}
