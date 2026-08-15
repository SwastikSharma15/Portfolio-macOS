"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { useAppState } from "@/lib/app-state"
import { HomeIndicator } from "@/components/ios/home-indicator"

interface AppWrapperOptions {
  hideHeader?: boolean;
  title?: string;
}

export const AppWrapper = (WrappedComponent: React.ComponentType<any>, options?: AppWrapperOptions) => {
  return function WrappedApp(props: any) {
    const { closeApp } = useAppState()

    const handleBackClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      closeApp()
    }

    const hideHeader = options?.hideHeader
    const title = options?.title || "App"

    return (
      <HomeIndicator>
        <div className="h-full w-full bg-[#f2f2f7] relative overflow-hidden text-black">
          {!hideHeader && (
            <div className="absolute top-0 left-0 right-0 z-50 pt-12 pb-3 px-4 flex items-center justify-between bg-white/75 backdrop-blur-xl border-b border-gray-200/50">
              <motion.button
                whileTap={{ opacity: 0.5 }}
                onClick={handleBackClick}
                className="text-blue-500 z-10 flex items-center gap-1 -ml-1"
              >
                <ChevronLeft className="h-7 w-7 stroke-[2.5]" />
                <span className="text-lg font-normal">Back</span>
              </motion.button>

              <div className="absolute inset-0 top-12 flex items-center justify-center pointer-events-none">
                <span className="font-semibold text-[17px] text-black">
                  {title}
                </span>
              </div>

              <div className="w-16" /> {/* Spacer to balance flex layout if needed, though absolute center takes care of title */}
            </div>
          )}

          <div className={`h-full w-full ${hideHeader ? "overflow-hidden" : "overflow-y-auto pt-[90px]"}`}>
            <WrappedComponent {...props} />
          </div>
        </div>
      </HomeIndicator>
    )
  }
}
