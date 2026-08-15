"use client"

import type React from "react"
import { BrightnessOverlay } from "./brightness-overlay"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BrightnessOverlay />
    </>
  )
}
