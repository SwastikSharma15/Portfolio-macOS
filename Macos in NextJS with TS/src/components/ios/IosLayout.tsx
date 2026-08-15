"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LockScreen } from "@/components/ios/lock-screen"
import { HomeScreen } from "@/components/ios/home-screen"
import { useAppState } from "@/lib/app-state"
import { ControlCenter } from "@/components/ios/control-center/control-center"
import { SwipeDetector } from "@/components/ios/swipe-detector"

import { Clock } from "@/components/ios/ios-clock"
import { Settings } from "@/components/ios/settings"
import { Weather } from "@/components/ios/weather"
import { Calendar } from "@/components/ios/calendar"
import { Camera } from "@/components/ios/camera"
import { Photos } from "@/components/ios/photos"
import { NotesApp } from "@/components/ios/notes/notes-app"
import { MessagesApp } from "@/components/ios/messages/messages-app"
import { SafariApp } from "@/components/ios/safari/safari-app"
import { MusicApp } from "@/components/ios/music/music-app"
import { PhoneApp } from "@/components/ios/phone/phone-app"
import { MapsApp } from "@/components/ios/maps"
import { GameApp } from "@/components/ios/game"
import { ContactApp } from "@/components/ios/contact"
import { FinderApp } from "@/components/ios/finder"
import { CalculatorApp } from "@/components/ios/calculator"
import { AppWrapper } from "@/components/ios/hoc/AppWrapper"
import { StatusBar } from "./status-bar"

const Apps = {
  clock: AppWrapper(Clock, { title: "Clock" }),
  settings: AppWrapper(Settings, { title: "Settings" }),
  weather: AppWrapper(Weather, { title: "Weather" }),
  calendar: AppWrapper(Calendar, { title: "Calendar" }),
  camera: AppWrapper(Camera, { hideHeader: true }),
  photos: AppWrapper(Photos, { hideHeader: true }),
  notes: AppWrapper(NotesApp, { title: "Notes" }),
  messages: AppWrapper(MessagesApp, { title: "Messages" }),
  safari: AppWrapper(SafariApp, { title: "Safari" }),
  music: AppWrapper(MusicApp, { title: "Music" }),
  phone: AppWrapper(PhoneApp, { title: "Phone" }),
  maps: AppWrapper(MapsApp, { hideHeader: true }),
  games: AppWrapper(GameApp, { title: "Games" }),
  contact: AppWrapper(ContactApp, { title: "Contact" }),
  finder: AppWrapper(FinderApp, { title: "Files" }),
  calculator: AppWrapper(CalculatorApp, { title: "Calculator" }),
}

export default function IosLayout() {
  const { currentApp, isLocked, appOriginRect } = useAppState()
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  // Track which app is actually rendered (stays during close animation)
  const [renderedApp, setRenderedApp] = useState<string | null>(null)
  const [animState, setAnimState] = useState<"idle" | "opening" | "open" | "closing">("idle")
  const appContainerRef = useRef<HTMLDivElement>(null)
  const layoutRef = useRef<HTMLDivElement>(null)
  const lastOriginRef = useRef<DOMRect | null>(null)
  const prevAppRef = useRef<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate the transform to position the full-screen app at the icon's location
  const getOriginTransform = useCallback((originRect: DOMRect | null) => {
    if (!originRect || !layoutRef.current) {
      // Fallback: scale from center of screen
      return {
        transform: "translate3d(50%, 50%, 0) scale(0.01)",
        hasFallback: true,
      }
    }

    const layoutRect = layoutRef.current.getBoundingClientRect()
    const translateX = originRect.left - layoutRect.left
    const translateY = originRect.top - layoutRect.top
    const scaleX = originRect.width / layoutRect.width
    const scaleY = originRect.height / layoutRect.height

    return {
      transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`,
      hasFallback: false,
    }
  }, [])

  // Detect app open
  useEffect(() => {
    if (currentApp && currentApp !== prevAppRef.current) {
      // New app being opened
      lastOriginRef.current = appOriginRect
      setRenderedApp(currentApp)
      setAnimState("opening")
    } else if (!currentApp && prevAppRef.current) {
      // App being closed
      setAnimState("closing")
    }
    prevAppRef.current = currentApp
  }, [currentApp, appOriginRect])

  // Opening animation
  useEffect(() => {
    if (animState !== "opening" || !appContainerRef.current || !renderedApp) return

    const container = appContainerRef.current
    const { transform: originTransform, hasFallback } = getOriginTransform(lastOriginRef.current)

    // Set initial position (at icon) with no transition
    container.style.transition = "none"
    container.style.transform = originTransform
    container.style.borderRadius = hasFallback ? "0px" : "14px"
    container.style.opacity = "1"
    container.style.visibility = "visible"

    // Force reflow so the initial transform is applied
    void container.offsetWidth

    // Animate to full-screen
    container.style.transition = "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.4s cubic-bezier(0.32, 0.72, 0, 1)"
    container.style.transform = "translate3d(0, 0, 0) scale(1)"
    container.style.borderRadius = "0px"

    const onEnd = (e: TransitionEvent) => {
      if (e.target === container && e.propertyName === "transform") {
        setAnimState("open")
        container.removeEventListener("transitionend", onEnd)
      }
    }
    container.addEventListener("transitionend", onEnd)

    return () => container.removeEventListener("transitionend", onEnd)
  }, [animState, renderedApp, getOriginTransform])

  // Closing animation
  useEffect(() => {
    if (animState !== "closing" || !appContainerRef.current) return

    const container = appContainerRef.current
    const { transform: originTransform, hasFallback } = getOriginTransform(lastOriginRef.current)

    container.style.transition = "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease 0.15s"
    container.style.transform = originTransform
    container.style.borderRadius = hasFallback ? "0px" : "14px"
    container.style.opacity = "0"

    const onEnd = (e: TransitionEvent) => {
      if (e.target === container && e.propertyName === "transform") {
        setAnimState("idle")
        setRenderedApp(null)
        lastOriginRef.current = null
        // Reset styles
        container.style.transition = "none"
        container.style.transform = ""
        container.style.borderRadius = ""
        container.style.opacity = "0"
        container.style.visibility = "hidden"
        container.removeEventListener("transitionend", onEnd)
      }
    }
    container.addEventListener("transitionend", onEnd)

    return () => container.removeEventListener("transitionend", onEnd)
  }, [animState, getOriginTransform])

  if (!mounted) return null

  const ActiveApp = renderedApp ? Apps[renderedApp as keyof typeof Apps] : null

  const isDarkStatusBar = currentApp === "camera" || currentApp === "games"

  return (
    <div
      className={`
      flex flex-col items-center justify-center h-[100dvh] w-screen overflow-hidden transition-all duration-500 select-none relative bg-transparent
    `}
    >
      <SwipeDetector>
        <div ref={layoutRef} className="relative h-full w-full overflow-hidden">
          {/* Always visible top Status Bar across all apps */}
          {!isLocked && (
            <div className="absolute top-0 left-0 right-0 z-[60] pointer-events-none">
              <StatusBar time={time} dark={isDarkStatusBar} />
            </div>
          )}

          {/* Home Screen / Lock Screen */}
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="lock-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <LockScreen time={time} />
              </motion.div>
            ) : (
              <motion.div
                key="home-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <HomeScreen time={time} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* App Container - position-aware animation layer */}
          <div
            ref={appContainerRef}
            className="absolute inset-0 pointer-events-auto z-10"
            style={{
              transformOrigin: "top left",
              willChange: "transform",
              visibility: "hidden",
              opacity: 0,
              overflow: "hidden",
            }}
          >
            {ActiveApp && <ActiveApp />}
          </div>

          {/* Control Center */}
          <ControlCenter />
        </div>
      </SwipeDetector>
    </div>
  )
}
