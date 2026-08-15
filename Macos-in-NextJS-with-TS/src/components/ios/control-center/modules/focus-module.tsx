"use client"

import { useState } from "react"
import { Moon, MessageCircle, BellRing } from "lucide-react"
import { cn } from "@/lib/utils"

export function FocusModule() {
  const [isFocusActive, setIsFocusActive] = useState(false)

  return (
    <button
      className={cn(
        "bg-white/50 backdrop-blur-md rounded-2xl p-3 flex items-center",
        isFocusActive ? "bg-purple-500/30" : "bg-white/70",
      )}
      onClick={() => setIsFocusActive(!isFocusActive)}
    >
      <div className="flex space-x-2">
        <div className="w-8 h-8 rounded-full bg-purple-500/50 flex items-center justify-center">
          <Moon className="h-4 w-4 text-black" />
        </div>
        <div className="w-8 h-8 rounded-full bg-green-500/50 flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-black" />
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500/50 flex items-center justify-center">
          <BellRing className="h-4 w-4 text-black" />
        </div>
      </div>

      <div className="ml-3 text-black font-medium">Focus</div>
    </button>
  )
}
