"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useAppState } from "@/lib/app-state"

interface HomeIndicatorProps {
  children: React.ReactNode
}

export function HomeIndicator({ children }: HomeIndicatorProps) {
  const { closeApp } = useAppState()
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle swipe up gesture
  useEffect(() => {
    let touchStartY = 0
    let isSwipingFromBottom = false

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const relativeY = touchStartY - rect.top
        isSwipingFromBottom = relativeY > rect.height * 0.85
      } else {
        const windowHeight = window.innerHeight;
        isSwipingFromBottom = touchStartY > windowHeight * 0.85;
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipingFromBottom) return;

      const touchY = e.touches[0].clientY
      const diff = touchStartY - touchY

      // Prevent native scrolling if swiping up from bottom
      if (diff > 0 && e.cancelable) {
        e.preventDefault()
      }

      // If swiped up more than 100px, go home
      if (diff > 100) {
        closeApp()
      }
    }

    const element = containerRef.current
    if (element) {
      element.addEventListener("touchstart", handleTouchStart, { passive: false })
      element.addEventListener("touchmove", handleTouchMove, { passive: false })
    }

    return () => {
      if (element) {
        element.removeEventListener("touchstart", handleTouchStart)
        element.removeEventListener("touchmove", handleTouchMove)
      }
    }
  }, [closeApp])

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {children}

      {/* Home Indicator */}
      <div
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full z-[10000] opacity-30 cursor-pointer pointer-events-auto"
        onClick={closeApp}
      />
    </div>
  )
}
