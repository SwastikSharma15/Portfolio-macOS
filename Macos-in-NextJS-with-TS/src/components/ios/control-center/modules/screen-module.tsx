"use client"

import { useState } from "react"
import { LockIcon as LockRotate, Tv2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"

interface ScreenModuleProps {
  icon: "lock" | "screen"
  label: string
}

export function ScreenModule({ icon, label }: ScreenModuleProps) {
  const [isActive, setIsActive] = useState(false)
  const { lockDevice, closeControlCenter } = useAppState()

  const handleClick = () => {
    setIsActive(!isActive)
    if (icon === "lock") {
      lockDevice()
      closeControlCenter()
    }
  }

  return (
    <button
      className={cn(
        "rounded-full flex flex-col items-center justify-center aspect-square transition-colors",
        isActive ? "bg-white/40" : "bg-white/20",
      )}
      onClick={handleClick}
    >
      {icon === "lock" ? <LockRotate className="h-5 w-5 text-black" /> : <Tv2 className="h-5 w-5 text-black" />}
    </button>
  )
}
