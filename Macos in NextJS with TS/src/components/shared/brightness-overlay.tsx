"use client"

import { useAppState } from "@/lib/app-state"

export function BrightnessOverlay() {
  const { brightness } = useAppState()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        backgroundColor: `rgba(0, 0, 0, ${1 - brightness / 100})`,
        transition: 'background-color 0.2s ease',
      }}
    />
  )
}
