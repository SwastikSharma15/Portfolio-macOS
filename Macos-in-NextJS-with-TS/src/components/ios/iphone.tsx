"use client"

import { useAppState } from "@/lib/app-state"
import { HomeScreen } from "./home-screen"
import { MusicIsland } from "./dynamic-island/music-island"
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
import { AppWrapper } from "@/components/ios/hoc/AppWrapper"
import { Reminders } from "@/components/ios/reminders"

const Apps = {
  clock: AppWrapper(Clock, { title: "Clock" }),
  settings: AppWrapper(Settings, { title: "Settings" }),
  weather: AppWrapper(Weather, { title: "Weather" }),
  calendar: AppWrapper(Calendar, { title: "Calendar" }),
  reminders: AppWrapper(Reminders, { title: "Reminders" }),
  camera: AppWrapper(Camera, { hideHeader: true }),
  photos: AppWrapper(Photos, { hideHeader: true }),
  notes: AppWrapper(NotesApp, { hideHeader: true }),
  messages: AppWrapper(MessagesApp, { hideHeader: true }),
  safari: AppWrapper(SafariApp, { hideHeader: true }),
  music: AppWrapper(MusicApp, { hideHeader: true }),
  phone: AppWrapper(PhoneApp, { hideHeader: true }),
}

export function IPhone() {
  const { currentApp, openApp } = useAppState()
  
  const ActiveApp = currentApp ? Apps[currentApp as keyof typeof Apps] : null

  return (
    <div className="relative w-[375px] h-[812px] bg-black rounded-[55px] overflow-hidden">
      {/* iPhone Frame */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[34px] bg-black rounded-b-[20px] z-[9998]" />
      </div>

      {/* Dynamic Island - positioned with highest z-index */}
      <div className="absolute inset-0 z-[9999] pointer-events-auto">
        <MusicIsland />
      </div>

      {/* Screen Content */}
      <div className="relative w-full h-full bg-[#f6f6f6] overflow-hidden">
        {ActiveApp ? (
          <ActiveApp />
        ) : (
          <HomeScreen time={new Date()} />
        )}
      </div>
    </div>
  )
}
