"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useAppState } from "@/lib/app-state"

interface SwipeDetectorProps {
  children: React.ReactNode
}

export function SwipeDetector({ children }: SwipeDetectorProps) {
  const { openControlCenter, closeControlCenter, controlCenterOpen } = useAppState()
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY.current) return

      const touchY = e.touches[0].clientY
      const touchX = e.touches[0].clientX
      const deltaY = touchY - touchStartY.current
      const deltaX = touchX - touchStartX.current

      const windowHeight = window.innerHeight;
      const isTop20 = touchStartY.current < windowHeight * 0.15;

      // Only consider vertical swipes (ignore diagonal)
      if (Math.abs(deltaX) > Math.abs(deltaY) * 0.8) return

      // Swipe down from top 20% to open control center
      if (!controlCenterOpen && isTop20 && deltaY > 50) {
        e.preventDefault()
        openControlCenter()
      }

      // Swipe up anywhere to close control center (since it covers the whole screen)
      if (controlCenterOpen && deltaY < -50) {
        e.preventDefault()
        closeControlCenter()
      }
    }

    // Remove the direct click handler for testing as per the update request.

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
    }
  }, [openControlCenter, closeControlCenter, controlCenterOpen])

  return (
    <div ref={containerRef} className="h-full w-full">
      {children}
    </div>
  )
}
